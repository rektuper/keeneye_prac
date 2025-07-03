import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Alert } from '@mui/material';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
    const [form, setForm] = useState({ name: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { saveUser } = useAuth();

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleRegister = async () => {
        setError('');
        try {
            const res = await api.post('/register', {
                ...form,
                email: form.name,
                role: 'user',
            });
            saveUser({
                ...res.data,
                name: form.name,
                role: 'user',
            });
            navigate('/');
        } catch {
            setError('Ошибка регистрации. Возможно, имя уже используется.');
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Typography variant="h5" gutterBottom>Регистрация</Typography>
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
                onClick={handleRegister}
                sx={{ mt: 2 }}
            >
                Зарегистрироваться
            </Button>
        </Container>
    );
}
