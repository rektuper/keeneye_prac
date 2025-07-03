import React from 'react';
import { CssBaseline } from '@mui/material';
import AppRoutes from './routes';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <CssBaseline />
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;