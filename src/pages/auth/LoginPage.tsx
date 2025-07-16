import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Alert, Box, Link } from '@mui/material';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface LoginForm {
    email: string;
    password: string;
}

export default function LoginPage() {
    const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
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

    const handleLogin = async () => {
        setError('');
        if (!validateEmail(form.email)) {
            setEmailError('Пожалуйста, введите корректный email');
            return;
        }
        try {
            const res = await api.post('/auth', form);
            console.log('Login response:', res);
            saveToken(res.data.token);
            navigate('/');
        } catch {
            setError('Ошибка входа. Проверьте данные.');
        }
    };

    const isFormValid = form.email && form.password && !emailError;

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Typography variant="h5" gutterBottom>Вход</Typography>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
                label="Email"
                name="email"
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
                onClick={handleLogin}
                sx={{ mt: 2 }}
                disabled={!isFormValid}
            >
                Войти
            </Button>
            <Box mt={2} textAlign="center">
                <Typography variant="body2">
                    У вас еще нет аккаунта?{' '}
                    <Link
                        component="button"
                        variant="body2"
                        onClick={() => navigate('/register')}
                    >
                        Зарегистрируйтесь
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
}
