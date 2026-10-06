import './KnifeCard.css';

//соответствие статуса и цвета беджа
const statusClass = {
    'В наличии': 'knife-card__status--available',
    'Под заказ': 'knife-card__status--order',
    'Продан': 'knife-card__status--sold',
};

function KnifeCard(props) {
    const { knife, onSelect } = props;

    return (
        <article className="knife-card" onClick={onSelect}>
            <img
                className="knife-card__image"
                src={knife.image}
                alt={`Нож «${knife.name}»`}
            />
            <div className="knife-card__body">
                <h3 className="knife-card__name">{knife.name}</h3>
                <p className="knife-card__short">{knife.short}</p>
                <div className="knife-card__footer">
                    <span className="knife-card__price">{knife.price}</span>
                    <span className={`knife-card__status ${statusClass[knife.status] ?? ''}`}>
                        {knife.status}
                    </span>
                </div>
            </div>
        </article>
    );
}

export default KnifeCard;