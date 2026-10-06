import { useState } from 'react';
import './Nav.css';

function Nav(props) {
    const { links, onContact, onFortune } = props;
    const [isOpen, setIsOpen] = useState(false);

    const closeMenu = () => setIsOpen(false);

    return (
        <nav className="nav">
            <div className="nav__inner container">
                <button
                    className={`nav__burger ${isOpen ? 'nav__burger--open' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
                    aria-expanded={isOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <ul className={`nav-list ${isOpen ? 'nav-list--open' : ''}`}>
                    {links.map(link => (
                        <li key={link.href}>
                            <a href={link.href} onClick={closeMenu}>{link.label}</a>
                        </li>
                    ))}
                </ul>

                <div className="nav__actions">
                    <button
                        className="nav__fortune"
                        onClick={() => { onFortune(); closeMenu(); }}
                        aria-label="Колесо Фортуны"
                        title="Колесо Фортуны"
                    >
                        🎰
                    </button>
                    <button className="nav-svaz" onClick={onContact}>Связаться</button>
                </div>
            </div>
        </nav>
    );
}

export default Nav;