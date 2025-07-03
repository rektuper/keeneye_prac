import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Alert } from '@mui/material';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const { saveToken } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleRegister = async () => {
        setError('');
        try {
            const res = await api.post('/register', {
                ...form,
                role: 'user'
            });
            console.log('Register response:', res.data);
            saveToken(res.data.token);
            navigate('/');
        } catch {
            setError('Ошибка регистрации. Возможно, email уже занят.');
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Typography variant="h5" gutterBottom>Регистрация</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField label="Имя" name="fullName" fullWidth margin="normal" onChange={handleChange} />
            <TextField label="Email" name="email" fullWidth margin="normal" onChange={handleChange} />
            <TextField label="Пароль" name="password" type="password" fullWidth margin="normal" onChange={handleChange} />
            <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleRegister}>
                Зарегистрироваться
            </Button>
        </Container>
    );
}