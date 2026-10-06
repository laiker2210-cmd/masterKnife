import { contacts } from '../../data/contacts';
import './Contacts.css';

function Contacts(props) {
    const { onContact } = props;

    const message = 'Здравствуйте! Хочу задать вопрос о ножах.';// тут как то немного непонятно, но рекомендовали 2 метода на выбор encodeURIComponent и encodeURI, но у первого сказали символов больше
    const whatsappLink = `https://wa.me/${contacts.whatsapp}?text=${encodeURIComponent(message)}`;

    return (
        <section className="contacts" id="contacts">
            <div className="contacts__inner container">
                <h2 className="contacts__title">Контакты</h2>
                <p className="contacts__subtitle">Позвоните или напишите — ответим в течение дня</p>

                <a className="contacts__phone" href={contacts.phoneHref}>
                    {contacts.phone}
                </a>

                <div className="contacts__messengers">
                    <a className="contacts__btn contacts__btn--wa"
                        href={whatsappLink} target="_blank" rel="noreferrer">
                        WhatsApp
                    </a>
                    <a className="contacts__btn contacts__btn--vk"
                        href={contacts.vk} target="_blank" rel="noreferrer">
                        ВКонтакте
                    </a>
                    <a className="contacts__btn contacts__btn--max"
                        href={contacts.max} target="_blank" rel="noreferrer">
                        MAX
                    </a>
                </div>

                <button className="contacts__cta" onClick={onContact}>
                    Оставить заявку
                </button>
            </div>
        </section>
    );
}

export default Contacts;