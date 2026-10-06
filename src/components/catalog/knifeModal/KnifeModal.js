
import Modal from '../../modal/Modal';
import './KnifeModal.css';

function KnifeModal(props) {
    const { knife, onClose, onContact } = props;

    const handleContact = () => {
        onClose();// закрываем окно ножа
        onContact(knife);//открываем связаться с этим ножом
    };

    return (
        <Modal onClose={onClose}>
            <img className="knife-modal__image" src={knife.image} alt={`Нож «${knife.name}»`} />
            <h2 className="knife-modal__name">{knife.name}</h2>
            <p className="knife-modal__meta">{knife.status} · {knife.price}</p>

            {knife.specs && (
                <ul className="knife-modal__specs">
                    {Object.entries(knife.specs).map(([key, value]) => (
                        <li key={key}><span>{key}:</span> {value}</li>
                    ))}
                </ul>
            )}

            <p className="knife-modal__description">{knife.description}</p>
            <button className="knife-modal__cta" onClick={handleContact}>Узнать подробнее</button>
        </Modal>
    );
}

export default KnifeModal;
