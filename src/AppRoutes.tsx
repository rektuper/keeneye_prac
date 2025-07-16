import React, { ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import SubmitRequestPage from './pages/SubmitRequestPage';
import RequestViewPage from './pages/RequestViewPage';
import UserRequestsPage from './pages/UserRequestsPage';
import ObjectsPage from './pages/manager/ObjectsPage';
import RequestsPage from './pages/manager/RequestsPage';
import { useAuth } from './context/AuthContext';

type Role = 'manager' | 'user';

interface PrivateRouteProps {
    children: ReactNode;
    roles?: Role[];
}

function PrivateRoute({ children, roles }: PrivateRouteProps) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && (!user.role || !roles.includes(user.role as Role))) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
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
