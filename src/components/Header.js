import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleMenuClose();
        navigate('/login');
    };

    const handleNavigate = (path) => {
        navigate(path);
        handleMenuClose();
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                >
                    СтройСервис
                </Typography>

                {!user && (
                    <>
                        <Button color="inherit" onClick={() => navigate('/login')}>
                            Войти
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/register')}>
                            Регистрация
                        </Button>
                    </>
                )}

                {user && (
                    <Box>
                        <Button
                            color="inherit"
                            onClick={handleMenuOpen}
                            sx={{ textTransform: 'none' }}
                        >
                            {user.fullName || user.name || user.email || 'Пользователь'}
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleMenuClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >

                            <MenuItem onClick={() => handleNavigate('/')}>Главная</MenuItem>
                            <MenuItem onClick={() => handleNavigate('/my-requests')}>Мои заявки</MenuItem>

                            {user.role === 'manager' && (
                                <>
                                    <MenuItem onClick={() => handleNavigate('/manager/objects')}>
                                        Объекты
                                    </MenuItem>
                                    <MenuItem onClick={() => handleNavigate('/manager/requests')}>
                                        Заявки
                                    </MenuItem>
                                </>
                            )}

                            <MenuItem onClick={handleLogout}>Выйти</MenuItem>
                        </Menu>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}
