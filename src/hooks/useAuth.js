import { useEffect, useState } from 'react';
import api from '../api/api';

export default function useAuth() {
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        try {
            const res = await api.get('/users');
            setUser(res.data);
        } catch (e) {
            setUser(null);
        }
    };

    const logout = async () => {
        await api.post('/logout');
        setUser(null);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return { user, setUser, fetchUser, logout };
}