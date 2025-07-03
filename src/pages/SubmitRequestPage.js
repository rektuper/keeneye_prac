import React, { useState, useEffect } from 'react';
import {
    Container, TextField, Button, Typography, MenuItem, Alert, Box,
} from '@mui/material';
import { createRequest, getObjects } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function SubmitRequestPage() {
    const { user } = useAuth();

    const [form, setForm] = useState({
        title: '',
        description: '',
        email: '',
        objectId: '',
    });
    const [objects, setObjects] = useState([]);
    const [successLink, setSuccessLink] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        getObjects()
            .then((res) => setObjects(res.data))
            .catch(() => setObjects([]));
    }, []);

    useEffect(() => {
        if (user && user.email) {
            setForm(prev => ({ ...prev, email: user.email }));
        }
    }, [user]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        setError('');
        try {
            const requestData = {
                title: form.title,
                description: form.description,
                email: form.email,
                objectId: form.objectId,
                date: new Date().toISOString(),
                status: 'pending',
            };
            if (user && user.id) {
                requestData.userId = user.id;
            }
            const res = await createRequest(requestData);
            setSuccessLink(`${window.location.origin}/request/${res.data.id}`);
        } catch {
            setError('Ошибка при создании заявки');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h5" mb={3}>
                Подача заявки на устранение недочётов
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}
            {successLink && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Заявка создана! Статус можно посмотреть по ссылке:{' '}
                    <a href={successLink}>{successLink}</a>
                </Alert>
            )}

            <TextField
                label="Название"
                name="title"
                value={form.title}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Описание"
                name="description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                margin="normal"
            />
            <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                type="email"
                disabled={!!user}
            />
            <TextField
                select
                label="Объект"
                name="objectId"
                value={form.objectId}
                onChange={handleChange}
                fullWidth
                margin="normal"
            >
                {objects.map((obj) => (
                    <MenuItem key={obj.id} value={obj.id}>
                        {obj.name} — {obj.address}
                    </MenuItem>
                ))}
            </TextField>

            <Box mt={3}>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={
                        !form.title ||
                        !form.description ||
                        !form.email ||
                        !form.objectId
                    }
                >
                    Отправить заявку
                </Button>
            </Box>
        </Container>
    );
}
