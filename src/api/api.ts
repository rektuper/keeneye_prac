import axios from 'axios';

const API_BASE = 'https://a0c761cdabb5748b.mokky.dev';

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Типы
export interface User {
    id: string;
    fullName: string;
    email: string;
    role: 'manager' | 'user';
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface RequestItem {
    id: string;
    title: string;
    description: string;
    email: string;
    objectId: string;
    status: 'pending' | 'completed' | 'rejected';
    date: string;
    userId?: string;
}

export interface ObjectItem {
    id: string;
    name: string;
    address: string;
}

// Авторизация
export const login = (email: string, password: string) =>
    api.post<AuthResponse>('/auth', { email, password });

export const register = (fullName: string, email: string, password: string) =>
    api.post<AuthResponse>('/register', { fullName, email, password });

// Заявки
export const getRequests = (params?: Record<string, any>) =>
    api.get<RequestItem[]>('/requests', { params });

export const getRequestById = (id: string) =>
    api.get<RequestItem>(`/requests/${id}`);

export const createRequest = (data: Omit<RequestItem, 'id'>) =>
    api.post<RequestItem>('/requests', data);

export const updateRequestStatus = (id: string, status: RequestItem['status']) =>
    api.patch<RequestItem>(`/requests/${id}`, { status });

// Объекты
export const getObjects = (params?: Record<string, any>) =>
    api.get<ObjectItem[]>('/objects', { params });

export const createObject = (data: Omit<ObjectItem, 'id'>) =>
    api.post<ObjectItem>('/objects', data);

export const updateObject = (id: string, data: Partial<ObjectItem>) =>
    api.patch<ObjectItem>(`/objects/${id}`, data);

export const deleteObject = (id: string) =>
    api.delete(`/objects/${id}`);

export default api;
