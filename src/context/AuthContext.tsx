import React, { createContext, useContext, useState, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
    id: number;
    name: string;
    role?: string;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    saveToken: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const [user, setUser] = useState<User | null>(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            try {
                return jwtDecode<User>(savedToken);
            } catch {
                return null;
            }
        }
        return null;
    });

    const saveToken = (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(jwtDecode<User>(newToken));
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, saveToken, logout }}>
    {children}
    </AuthContext.Provider>
);
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
