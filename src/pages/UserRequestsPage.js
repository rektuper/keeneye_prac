import React, { useEffect, useState } from 'react';
import {
    Container, Typography, TableContainer, Table, TableHead, TableRow, TableCell,
    TableBody, Paper, CircularProgress, TablePagination, Box,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

export default function UserRequestsPage() {
    const { user, token } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (!user) {
            setRequests([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        api.get('/requests', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                const filtered = res.data.filter(r => r.userId === user.id);
                setRequests(filtered);
                setTotal(filtered.length);
            })
            .catch(() => {
                setRequests([]);
                setTotal(0);
            })
            .finally(() => setLoading(false));
    }, [user, token]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Для пагинации берём срез
    const paginatedRequests = requests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Мои заявки
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Название</TableCell>
                                    <TableCell>Описание</TableCell>
                                    <TableCell>Статус</TableCell>
                                    <TableCell>Дата подачи</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedRequests.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            Заявки не найдены
                                        </TableCell>
                                    </TableRow>
                                )}
                                {paginatedRequests.map((req) => (
                                    <TableRow
                                        key={req.id}
                                        hover
                                        onClick={() => window.open(`/request/${req.id}`, '_blank')}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>{req.title}</TableCell>
                                        <TableCell>{req.description}</TableCell>
                                        <TableCell>{req.status}</TableCell>
                                        <TableCell>
                                            {new Date(req.date).toLocaleDateString()}{' '}
                                            {new Date(req.date).toLocaleTimeString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        component="div"
                        count={total}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                    />
                </>
            )}
        </Container>
    );
}
