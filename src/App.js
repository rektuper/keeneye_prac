import React from 'react';
import { CssBaseline } from '@mui/material';
import AppRoutes from './AppRoutes';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';

function App() {
    return (
        <AuthProvider>
            <CssBaseline />
            <Header />
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;