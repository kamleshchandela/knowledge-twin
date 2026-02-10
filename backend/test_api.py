import os
import requests
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def test_api():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("❌ Error: GEMINI_API_KEY NOT FOUND in .env")
        return

    print(f"--- Diagnostic Report for Key Ending in ...{api_key[-5:]} ---")
    
    # 1. Raw Request Check (Listing Models)
    print("\n[Step 1] Checking API access via raw requests...")
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            print("✅ Raw Model List: SUCCESS")
            models = response.json().get('models', [])
            print("Available Models:")
            for m in models:
                print(f" - {m['name']}")
        else:
            print(f"❌ Raw Model List: FAILED ({response.status_code})")
            print(f"   Reason: {response.text}")
    except Exception as e:
        print(f"❌ Raw Request Error: {e}")

    # 2. Official SDK Check
    print("\n[Step 2] Checking via Google Generative AI SDK...")
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        # Try a tiny response
        response = model.generate_content("Hi", generation_config={"max_output_tokens": 10})
        print(f"✅ SDK Generation: SUCCESS! Response: {response.text.strip()}")
    except Exception as e:
        print(f"❌ SDK Generation: FAILED")
        print(f"   Error Type: {type(e).__name__}")
        print(f"   Error Detail: {str(e)}")

    # 3. Final Conclusion
    print("\n--- Final Summary ---")
    if "403" in str(locals().get('response', '')) or "403" in str(locals().get('e', '')):
        print("🚨 CRITICAL: This API Key is RESTRICTED or SUSPENDED by Google.")
        print("   This is NOT a code bug. Your Google AI account has a block.")
    else:
        print("✨ Key seems to be working for basic tasks. Check if you hit quota.")

if __name__ == "__main__":
    test_api()

