import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import SubmitRequestPage from './pages/SubmitRequestPage';
import RequestViewPage from './pages/RequestViewPage';
import ObjectsPage from './pages/manager/ObjectsPage';
import RequestsPage from './pages/manager/RequestsPage';
import UserRequestsPage from './pages/UserRequestsPage';
import { useAuth } from './context/AuthContext';

function PrivateRoute({ children, roles }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }
    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" />;
    }
    return children;
}

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<SubmitRequestPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/request/:id" element={<RequestViewPage />} />

            <Route
                path="/manager/objects"
                element={
                    <PrivateRoute roles={['manager']}>
                        <ObjectsPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/manager/requests"
                element={
                    <PrivateRoute roles={['manager']}>
                        <RequestsPage />
                    </PrivateRoute>
                }
            />

            <Route
                path="/my-requests"
                element={
                    <PrivateRoute>
                        <UserRequestsPage />
                    </PrivateRoute>
                }
            />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}
