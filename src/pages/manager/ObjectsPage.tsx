import React, { useEffect, useState } from 'react';
import {
    Container, Typography, TableContainer, Table, TableHead, TableRow, TableCell,
    TableBody, Paper, CircularProgress, TablePagination, Box, TextField,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getObjects, deleteObject, updateObject, ObjectItem } from '../../api/api';

interface EnhancedObjectItem extends ObjectItem {
    createdAt?: string;
    requestsCount?: number;
}

export default function ObjectsPage() {
    const [objects, setObjects] = useState<EnhancedObjectItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [search, setSearch] = useState('');

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editObject, setEditObject] = useState<EnhancedObjectItem | null>(null);
    const [editName, setEditName] = useState('');
    const [editAddress, setEditAddress] = useState('');

    const fetchObjects = () => {
        setLoading(true);
        getObjects()
            .then((res) => setObjects(res.data))
            .catch(() => setObjects([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchObjects();
    }, []);

    const handleDelete = async (id?: string) => {
        if (!id) return;
        if (window.confirm('Удалить объект?')) {
            await deleteObject(id);
            fetchObjects();
        }
    };

    const handleEditClick = (obj: EnhancedObjectItem) => {
        setEditObject(obj);
        setEditName(obj.name);
        setEditAddress(obj.address);
        setEditDialogOpen(true);
    };

    const handleEditSave = async () => {
        if (editObject) {
            await updateObject(editObject.id, {
                name: editName,
                address: editAddress
            });
            setEditDialogOpen(false);
            fetchObjects();
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filtered = objects.filter(obj =>
        obj.name.toLowerCase().includes(search.toLowerCase()) ||
        obj.address.toLowerCase().includes(search.toLowerCase())
    );

    const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>Объекты</Typography>

            <Box mb={2}>
                <TextField
                    label="Поиск по названию или адресу"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    fullWidth
                />
            </Box>

            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Название</TableCell>
                                    <TableCell>Адрес</TableCell>
                                    <TableCell>Дата регистрации</TableCell>
                                    <TableCell>Количество заявок</TableCell>
                                    <TableCell align="right">Действия</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginated.map((obj) => (
                                    <TableRow key={obj.id} hover>
                                        <TableCell>{obj.id}</TableCell>
                                        <TableCell>{obj.name}</TableCell>
                                        <TableCell>{obj.address}</TableCell>
                                        <TableCell>—</TableCell>
                                        <TableCell>—</TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => handleEditClick(obj)}><EditIcon /></IconButton>
                                            <IconButton onClick={() => handleDelete(obj.id)} color="error"><DeleteIcon /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        component="div"
                        count={filtered.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                    />
                </>
            )}

            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Редактировать объект</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Название"
                        fullWidth
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Адрес"
                        fullWidth
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Отмена</Button>
                    <Button onClick={handleEditSave} variant="contained">Сохранить</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
