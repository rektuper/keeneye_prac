import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                        Строительная CRM
                    </Link>
                </Typography>

                {user ? (
                    <Box>
                        <Typography variant="body1" sx={{ display: 'inline', mr: 2 }}>
                            {user.name || user.email}
                        </Typography>
                        <Button color="inherit" onClick={logout}>Выйти</Button>
                    </Box>
                ) : (
                    <Box>
                        <Button color="inherit" component={Link} to="/login">Войти</Button>
                        <Button color="inherit" component={Link} to="/register">Регистрация</Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}
