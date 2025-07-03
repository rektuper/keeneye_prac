import React, { useEffect, useState } from 'react';
import { Container, Typography, Alert, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { getRequestById } from '../api/api';

export default function RequestViewPage() {
    const { id } = useParams();
    const [request, setRequest] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRequestById(id)
            .then((res) => setRequest(res.data))
            .catch(() => setError('Заявка не найдена'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <Container sx={{ mt: 4, textAlign: 'center' }}><CircularProgress /></Container>;
    if (error) return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Статус заявки: {request.title}
            </Typography>
            <Typography>Описание: {request.description}</Typography>
            <Typography>Статус: {request.status}</Typography>
            <Typography>Дата подачи: {new Date(request.date).toLocaleString()}</Typography>
            <Typography>Объект ID: {request.objectId}</Typography>
        </Container>
    );
}
