import Modal from '../modal/Modal';
import { contacts } from '../../data/contacts';
import './ContactModal.css';

function ContactModal(props) {
    const { knife, onClose } = props;

    // текст, который подставится в сообщение WhatsApp
    const message = knife
        ? `Здравствуйте! Интересует нож «${knife.name}» (${knife.price}). Расскажите о нём подробнее.`
        : 'Здравствуйте! Хочу задать вопрос о ножах.';

    const whatsappLink = `https://wa.me/${contacts.whatsapp}?text=${encodeURIComponent(message)}`;

    return (
        <Modal onClose={onClose}>
            <h2 className="contact-modal__title">
                {knife ? <>Нож «{knife.name}»</> : 'Связаться с мастерской'}
            </h2>

            {knife && (
                <p className="contact-modal__hint">
                    Напишите нам — расскажем про этот нож, материалы и сроки.
                </p>
            )}

            <a className="contact-modal__phone" href={contacts.phoneHref}>
                {contacts.phone}
            </a>
            <p className="contact-modal__note">…или напишите в удобный мессенджер:</p>

            <div className="contact-modal__links">
                <a className="contact-modal__btn contact-modal__btn--wa"
                    href={whatsappLink} target="_blank" rel="noreferrer">
                    WhatsApp
                </a>
                <a className="contact-modal__btn contact-modal__btn--vk"
                    href={contacts.vk} target="_blank" rel="noreferrer">
                    ВКонтакте
                </a>
                <a className="contact-modal__btn contact-modal__btn--max"
                    href={contacts.max} target="_blank" rel="noreferrer">
                    MAX
                </a>
            </div>
        </Modal>
    );
}

export default ContactModal;