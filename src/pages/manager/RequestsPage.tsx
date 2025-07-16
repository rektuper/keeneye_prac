import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper,
    CircularProgress, TablePagination, TextField, Box, Button, Select, MenuItem
} from '@mui/material';
import { getRequests, updateRequestStatus, RequestItem } from '../../api/api';

export default function RequestsPage() {
    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchData();
    }, [search, statusFilter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getRequests();
            const filtered = res.data.filter((r) =>
                r.title.toLowerCase().includes(search.toLowerCase()) &&
                (statusFilter ? r.status === statusFilter : true)
            );
            setRequests(filtered);
            setTotal(filtered.length);
        } catch {
            setRequests([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: string, status: 'pending' | 'completed' | 'rejected') => {
        await updateRequestStatus(id, status);
        fetchData();
    };

    const paginated = requests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>История заявок</Typography>

            <Box display="flex" gap={2} mb={2}>
                <TextField
                    label="Поиск по названию"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    fullWidth
                />
                <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    displayEmpty
                    sx={{ minWidth: 200 }}
                >
                    <MenuItem value="">Все статусы</MenuItem>
                    <MenuItem value="pending">Ожидает</MenuItem>
                    <MenuItem value="completed">Выполнено</MenuItem>
                    <MenuItem value="rejected">Отклонено</MenuItem>
                </Select>
            </Box>

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
                                    <TableCell>Email</TableCell>
                                    <TableCell>Дата</TableCell>
                                    <TableCell>Статус</TableCell>
                                    <TableCell>Объект</TableCell>
                                    <TableCell>Действия</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginated.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">Заявки не найдены</TableCell>
                                    </TableRow>
                                )}
                                {paginated.map((req) => (
                                    <TableRow key={req.id}>
                                        <TableCell>{req.title}</TableCell>
                                        <TableCell>{req.description}</TableCell>
                                        <TableCell>{req.email}</TableCell>
                                        <TableCell>{new Date(req.date).toLocaleString()}</TableCell>
                                        <TableCell>{req.status}</TableCell>
                                        <TableCell>{req.objectId}</TableCell>
                                        <TableCell>
                                            {req.status !== 'completed' && (
                                                <Button size="small" color="success" onClick={() => handleStatusChange(req.id, 'completed')}>Выполнено</Button>
                                            )}
                                            {req.status !== 'rejected' && (
                                                <Button size="small" color="error" onClick={() => handleStatusChange(req.id, 'rejected')}>Отклонить</Button>
                                            )}
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
                        onPageChange={(e, newPage) => setPage(newPage)}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                        }}
                        rowsPerPageOptions={[5, 10, 25]}
                    />
                </>
            )}
        </Container>
    );
}