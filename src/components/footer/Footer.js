import { NavLinks } from '../../data/NavLinks';
import { contacts } from '../../data/contacts';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer__inner container">
                <div className="footer__brand">
                    <p className="footer__logo">Мастерская Тайга</p>
                    <p className="footer__note">Ножи ручной работы</p>
                </div>

                <nav className="footer__nav">
                    <ul>
                        {NavLinks.map(link => (
                            <li key={link.href}>
                                <a href={link.href}>{link.label}</a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="footer__contacts">
                    <a href={contacts.phoneHref}>{contacts.phone}</a>
                    <a href={contacts.vk} target="_blank" rel="noreferrer">ВКонтакте</a>
                    <a href={contacts.max} target="_blank" rel="noreferrer">MAX</a>
                </div>
            </div>

            <p className="footer__copy container">
                © 2026 Мастерская «Тайга». Все права защищены.
            </p>
        </footer>
    );
}

export default Footer;