import { useRef, useState } from 'react';
import Modal from '../modal/Modal';
import { galleryImages } from '../../data/gallery';
import './Gallery.css';

function Gallery() {
    const [selected, setSelected] = useState(null);
    const gridRef = useRef(null);

    const scroll = (direction) => {
        const grid = gridRef.current;
        if (!grid) return;
        grid.scrollBy({ left: direction * grid.clientWidth, behavior: 'smooth' });
    };

    return (
        <section className="gallery" id="gallery">
            <div className="gallery__inner container">
                <h2 className="gallery__title">Галерея</h2>
                <p className="gallery__subtitle">Процесс работы и крупные планы</p>

                <div className="gallery__grid" ref={gridRef}>
                    {galleryImages.map(img => (
                        <button
                            key={img.id}
                            className="gallery__item"
                            onClick={() => setSelected(img)}
                            aria-label={`Открыть фото: ${img.alt}`}
                        >
                            <img src={img.src} alt={img.alt} loading="lazy" />
                        </button>
                    ))}
                </div>

                <div className="gallery__controls">
                    <button className="gallery__arrow" onClick={() => scroll(-1)} aria-label="Предыдущие фото">←</button>
                    <button className="gallery__arrow" onClick={() => scroll(1)} aria-label="Следующие фото">→</button>
                </div>
            </div>

            {selected && (
                <Modal wide onClose={() => setSelected(null)}>
                    <img className="gallery__full" src={selected.src} alt={selected.alt} />
                </Modal>
            )}
        </section>
    );
}

export default Gallery;