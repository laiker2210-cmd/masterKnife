//заглушка

import './Admin.css';

function AdminDashboard() {
    return (
        <div className="admin-dashboard">
            <h2>Добро пожаловать в админ-панель</h2>
            <p>Здесь будут формы для управления контентом сайта:</p>
            <ul>
                <li>Ножи (добавление, редактирование, удаление)</li>
                <li>Отзывы</li>
                <li>Галерея</li>
                <li>Настройки рандомайзера</li>
            </ul>
            <p>Следующий шаг — создадим формы для редактирования данных.</p>
        </div>
    );
}

export default AdminDashboard;