import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const sendMessage = async (question, history = []) => {
    try {
        const response = await api.post('/query', { question, history });
        return response.data.answer;
    } catch (error) {
        console.error("API Error (Chat):", error);
        throw error;
    }
};

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("API Error (Upload):", error);
        throw error;
    }
};

export const clearMemory = async () => {
    try {
        await api.delete('/clear');
    } catch (error) {
        console.error("API Error (Clear):", error);
    }
};

export const fetchDashboardData = async () => {
    try {
        const response = await api.get('/dashboard');
        return response.data;
    } catch (error) {
        console.error("API Error (Dashboard):", error);
        return null;
    }
};

export const fetchFiles = async () => {
    try {
        const response = await api.get('/files');
        return response.data;
    } catch (error) {
        console.error("API Error (Files):", error);
        return [];
    }
};

export default api;
