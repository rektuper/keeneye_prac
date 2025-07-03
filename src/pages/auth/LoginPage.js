import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Alert } from '@mui/material';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
    const [form, setForm] = useState({ name: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { saveUser } = useAuth();

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLogin = async () => {
        setError('');
        try {
            const res = await api.post('/login', form);
            saveUser(res.data);  // сохраняем пользователя из ответа
            navigate('/');
        } catch {
            setError('Неверное имя или пароль');
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Typography variant="h5" gutterBottom>Вход</Typography>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
                label="Имя"
                name="name"
                fullWidth
                margin="normal"
                onChange={handleChange}
                value={form.name}
            />
            <TextField
                label="Пароль"
                name="password"
                type="password"
                fullWidth
                margin="normal"
                onChange={handleChange}
                value={form.password}
            />

            <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleLogin}
                sx={{ mt: 2 }}
            >
                Войти
            </Button>
        </Container>
    );
}
