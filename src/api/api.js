import axios from 'axios';

const API_BASE = 'https://a0c761cdabb5748b.mokky.dev';

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Авторизация
export const login = (email, password) =>
    api.post('/auth', { email, password });

export const register = (fullName, email, password) =>
    api.post('/register', { fullName, email, password });

// Заявки
export const getRequests = (params) =>
    api.get('/requests', { params });

export const getRequestById = (id) =>
    api.get(`/requests/${id}`);

export const createRequest = (data) =>
    api.post('/requests', data);

export const updateRequestStatus = (id, status) =>
    api.patch(`/requests/${id}`, { status });

// Объекты
export const getObjects = (params) =>
    api.get('/objects', { params });

export const createObject = (data) =>
    api.post('/objects', data);

export const updateObject = (id, data) =>
    api.patch(`/objects/${id}`, data);

export const deleteObject = (id) =>
    api.delete(`/objects/${id}`);

export default api;
