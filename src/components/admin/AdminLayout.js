//обёртка с проверкой авторизации

import { Outlet, Navigate, Link, useNavigate } from 'react-router-dom';
import './Admin.css';

function AdminLayout() {
    const navigate = useNavigate();
    const isAuth = sessionStorage.getItem('admin_auth') === '1';

    if (!isAuth) {
        return <Navigate to="/admin/login" replace />;
    }

    const handleLogout = () => {
        sessionStorage.removeItem('admin_auth');
        navigate('/');
    };

    return (
        <div className="admin-layout">
            <header className="admin-header">
                <h1>Админ-панель</h1>
                <nav>
                    <Link to="/admin">Главная</Link>
                    <button onClick={handleLogout}>Выйти</button>
                </nav>
            </header>
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;