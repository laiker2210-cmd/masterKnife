//обёртка с проверкой авторизации

import { useEffect, useState } from 'react';
import { Outlet, Navigate, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import './Admin.css';

function AdminLayout() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        (async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAuth(!!session);
            setLoading(false);
        })();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    if (loading) {
        return <div className="admin-loading">Загрузка...</div>;
    }

    if (!isAuth) {
        return <Navigate to="/admin/login" replace />;
    }

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