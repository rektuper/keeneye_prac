import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Alert,
    CircularProgress,
    Paper,
    Box,
    Divider,
    Chip,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { getRequestById, RequestItem } from '../api/api';

function getStatusColor(status: RequestItem['status']) {
    switch (status) {
        case 'pending':
            return 'warning';
        case 'completed':
            return 'success';
        case 'rejected':
            return 'error';
        default:
            return 'default';
    }
}

export default function RequestViewPage() {
    const { id } = useParams<{ id?: string }>();
    const [request, setRequest] = useState<RequestItem | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            setError('ID заявки не указан');
            setLoading(false);
            return;
        }

        getRequestById(id)
            .then((res) => setRequest(res.data))
            .catch(() => setError('Заявка не найдена'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <Container sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Заявка: {request?.title}
                </Typography>

                <Box my={2}>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        Описание
                    </Typography>
                    <Typography>{request?.description}</Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ minWidth: 100 }}>
                        Статус
                    </Typography>
                    <Chip
                        label={request?.status}
                        color={getStatusColor(request?.status!)}
                        sx={{ textTransform: 'capitalize' }}
                    />
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ minWidth: 100 }}>
                        Дата подачи
                    </Typography>
                    <Typography>
                        {request?.date ? new Date(request.date).toLocaleString() : '—'}
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center">
                    <Typography variant="subtitle1" color="text.secondary" sx={{ minWidth: 100 }}>
                        Объект ID
                    </Typography>
                    <Typography>{request?.objectId}</Typography>
                </Box>
            </Paper>
        </Container>
    );
}
