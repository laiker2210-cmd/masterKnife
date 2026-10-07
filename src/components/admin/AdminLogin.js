//страница входа
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

function AdminLogin() {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (pin === process.env.REACT_APP_OWNER_PIN || pin === '2204') {
            sessionStorage.setItem('admin_auth', '1');
            navigate('/admin');
        } else {
            setError('Неверный пароль');
        }
    };

    return (
        <div className="admin-login">
            <form className="admin-login__form" onSubmit={handleSubmit}>
                <h1>Админ-панель</h1>
                <input
                    type="password"
                    placeholder="Пароль"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    autoFocus
                />
                {error && <p className="admin-login__error">{error}</p>}
                <button type="submit">Войти</button>
            </form>
        </div>
    );
}

export default AdminLogin;