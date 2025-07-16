import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Alert, Link, Box } from '@mui/material';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface RegisterForm {
    fullName: string;
    email: string;
    password: string;
    role?: 'user' | 'manager';
}

export default function RegisterPage() {
    const [form, setForm] = useState<RegisterForm>({ fullName: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const navigate = useNavigate();
    const { saveToken } = useAuth();

    const validateEmail = (email: string): boolean => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        if (name === 'email') {
            if (!validateEmail(value)) {
                setEmailError('Некорректный email');
            } else {
                setEmailError('');
            }
        }
    };

    const handleRegister = async () => {
        setError('');
        if (!validateEmail(form.email)) {
            setEmailError('Пожалуйста, введите корректный email');
            return;
        }
        try {
            const dataToSend = {
                ...form,
                role: 'user',
            };
            const res = await api.post('/register', dataToSend);
            saveToken(res.data.token);
            navigate('/');
        } catch {
            setError('Ошибка регистрации. Возможно, email уже занят.');
        }
    };

    const isFormValid = form.fullName && form.email && form.password && !emailError;

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Typography variant="h5" gutterBottom>Регистрация</Typography>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
                label="Полное имя"
                name="fullName"
                fullWidth
                margin="normal"
                value={form.fullName}
                onChange={handleChange}
            />
            <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                margin="normal"
                value={form.email}
                onChange={handleChange}
                error={!!emailError}
                helperText={emailError}
            />
            <TextField
                label="Пароль"
                name="password"
                type="password"
                fullWidth
                margin="normal"
                value={form.password}
                onChange={handleChange}
            />
            <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleRegister}
                sx={{ mt: 2 }}
                disabled={!isFormValid}
            >
                Зарегистрироваться
            </Button>
            <Box mt={2} textAlign="center">
                <Typography variant="body2">
                    У вас есть аккаунт?{' '}
                    <Link
                        component="button"
                        variant="body2"
                        onClick={() => navigate('/login')}
                    >
                        Войдите
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
}
