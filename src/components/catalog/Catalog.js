import { useRef, useState } from 'react';
import KnifeCard from './knifeCard/KnifeCard';
import KnifeModal from './knifeModal/KnifeModal';
import './Catalog.css';

function Catalog(props) {
    const { knives, onContact } = props;
    const trackRef = useRef(null);
    const [selectedKnife, setSelectedKnife] = useState(null);

    //лента на 1 карточку
    const scroll = (direction) => {
        const track = trackRef.current;
        if (!track) return;
        track.scrollBy({ left: direction * track.clientWidth, behavior: 'smooth' });
    };

    return (
        <section className="catalog " id="catalog">
            <div className="catalog_cont container">
<h2 className="catalog__title">Наши ножи</h2>

            <div className="catalog__track" ref={trackRef}>
                {knives.map(knife => (
                    <KnifeCard
                        key={knife.id}
                        knife={knife}
                        onSelect={() => setSelectedKnife(knife)}
                    />
                ))}
            </div>

            <div className="catalog__controls">
                <button className="catalog__arrow" onClick={() => scroll(-1)} aria-label="Предыдущие ножи">←</button>
                <button className="catalog__arrow" onClick={() => scroll(1)} aria-label="Следующие ножи">→</button>
            </div>

            {selectedKnife && (
                <KnifeModal
                    knife={selectedKnife}
                    onClose={() => setSelectedKnife(null)}
                    onContact={onContact}
                />
            )}
            </div>
            
        </section>
    );
}

export default Catalog;