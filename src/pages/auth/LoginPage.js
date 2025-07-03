import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Alert } from '@mui/material';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { saveToken } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLogin = async () => {
        setError('');
        try {
            const res = await api.post('/auth', form);
            console.log('Login response:', res.data); // 👈 проверь токен
            saveToken(res.data.token);
            navigate('/');
        } catch {
            setError('Неверный логин или пароль');
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Typography variant="h5" gutterBottom>Вход</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField label="Email" name="email" fullWidth margin="normal" onChange={handleChange} />
            <TextField label="Пароль" name="password" type="password" fullWidth margin="normal" onChange={handleChange} />
            <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>
                Войти
            </Button>
        </Container>
    );
}
