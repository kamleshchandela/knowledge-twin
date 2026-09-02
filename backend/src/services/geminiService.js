const BLOCKED_MODEL_KEYWORDS = [
  'preview',
  'tts',
  'image',
  'robotics',
  'computer-use',
  'deep-research',
  'lyria',
  'nano-banana',
  'gemma',
];

const MODEL_CACHE_TTL_MS = 600_000;

let cachedModels = [];
let modelCacheTs = 0;

function getApiKey() {
  return process.env.GEMINI_API_KEY;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function discoverGenerateModels() {
  const apiKey = getApiKey();
  if (!apiKey) return [];
  if (cachedModels.length && Date.now() - modelCacheTs < MODEL_CACHE_TTL_MS) {
    return cachedModels;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetchWithTimeout(url, {}, 20_000);
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const body = await response.json();
    const models = body.models || [];

    const discovered = [];
    for (const model of models) {
      const methods = model.supportedGenerationMethods || [];
      const name = model.name || '';
      if (methods.includes('generateContent') && name.startsWith('models/')) {
        discovered.push(name.split('/').slice(1).join('/'));
      }
    }

    const stable = discovered.filter((m) => !BLOCKED_MODEL_KEYWORDS.some((k) => m.includes(k)));
    cachedModels = stable.length ? stable : discovered;
    modelCacheTs = Date.now();
    return cachedModels;
  } catch (e) {
    console.warn(`WARNING: Could not discover models: ${e.message}`);
    return cachedModels;
  }
}

export async function buildModelsToTry(preferred) {
  const available = await discoverGenerateModels();
  if (!available.length) return preferred;

  const ordered = [];
  for (const model of preferred) {
    if (available.includes(model) && !ordered.includes(model)) ordered.push(model);
  }
  for (const model of available) {
    if (!ordered.includes(model)) ordered.push(model);
  }
  return ordered;
}

const EMBEDDING_MODEL = 'gemini-embedding-001';
const EMBEDDING_DIM = 3072;

export async function getEmbedding(text) {
  const apiKey = getApiKey();
  if (!apiKey) return new Array(EMBEDDING_DIM).fill(0);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`;
  const body = {
    model: `models/${EMBEDDING_MODEL}`,
    content: { parts: [{ text }] },
  };

  const backoffsMs = [1500, 3000];
  for (let attempt = 0; attempt <= backoffsMs.length; attempt += 1) {
    try {
      const response = await fetchWithTimeout(
        url,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        },
        20_000,
      );

      if (response.status === 429) {
        if (attempt < backoffsMs.length) {
          console.log(`DEBUG: Embedding limit hit. Backing off ${backoffsMs[attempt]}ms (Attempt ${attempt + 1})...`);
          await delay(backoffsMs[attempt]);
          continue;
        }
        break;
      }
      if (!response.ok) throw new Error(`Status ${response.status}`);
      const result = await response.json();
      return result.embedding.values;
    } catch (e) {
      console.error(`Error getting embedding: ${e.message}`);
      if (attempt < backoffsMs.length) await delay(500);
    }
  }
  return new Array(EMBEDDING_DIM).fill(0);
}

export async function generateContent({ parts, generationConfig, models, isFastPath = false }) {
  const apiKey = getApiKey();
  const headers = { 'Content-Type': 'application/json' };
  const data = {
    contents: [{ parts }],
    ...(generationConfig ? { generationConfig } : {}),
  };
  const timeoutMs = isFastPath ? 12_000 : 20_000;

  let lastError = '';
  for (const modelName of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    console.log(`DEBUG: Trying ${modelName}...`);
    try {
      const response = await fetchWithTimeout(
        url,
        { method: 'POST', headers, body: JSON.stringify(data) },
        timeoutMs,
      );

      if (response.status === 429) {
        console.warn(`WARNING: 429 Rate Limit for ${modelName}. Trying next model...`);
        lastError = `Limit reached on ${modelName} (429).`;
        continue;
      }
      if (response.status === 404) {
        console.log(`DEBUG: Model ${modelName} not available (404). Skipping...`);
        lastError = `Model unavailable: ${modelName} (404).`;
        continue;
      }
      if (response.status === 403) {
        lastError = 'API Key forbidden (403).';
        continue;
      }
      if (!response.ok) {
        const text = await response.text();
        lastError = `API Status ${response.status}: ${text.slice(0, 100)}`;
        continue;
      }

      const result = await response.json();
      const candidates = result.candidates || [];
      if (candidates.length) {
        const resParts = candidates[0]?.content?.parts || [];
        if (resParts.length && 'text' in resParts[0]) {
          return resParts[0].text;
        }
      }
      lastError = `No text candidates returned by ${modelName}.`;
    } catch (e) {
      console.error(`CRITICAL: System error on ${modelName}: ${e.message}`);
      lastError = 'Server connectivity issue.';
    }
  }

  return { error: true, message: `Error: model response unavailable right now. Details: ${lastError}` };
}
