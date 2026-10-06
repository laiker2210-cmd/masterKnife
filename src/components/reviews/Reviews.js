import { useRef } from 'react';
import { reviews } from '../../data/reviews';
import './Reviews.css';

function Reviews() {
    const gridRef = useRef(null);

    const scroll = (direction) => {
        const grid = gridRef.current;
        if (!grid) return;
        grid.scrollBy({ left: direction * grid.clientWidth, behavior: 'smooth' });
    };

    return (
        <section className="reviews" id="reviews">
            <div className="reviews__inner container">
                <h2 className="reviews__title">Отзывы</h2>

                <div className="reviews__grid" ref={gridRef}>
                    {reviews.map(review => (
                        <article key={review.id} className="review-card">
                            <div className="review-card__header">
                                <span className="review-card__author">{review.author}</span>
                                <span className="review-card__date">{review.date}</span>
                            </div>

                            <span className="review-card__stars" aria-label={`Оценка ${review.rating} из 5`}>
                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                            </span>

                            <p className="review-card__knife">{review.knife}</p>
                            <p className="review-card__text">{review.text}</p>
                        </article>
                    ))}
                </div>

                <div className="reviews__controls">
                    <button className="reviews__arrow" onClick={() => scroll(-1)} aria-label="Предыдущие отзывы">←</button>
                    <button className="reviews__arrow" onClick={() => scroll(1)} aria-label="Следующие отзывы">→</button>
                </div>
            </div>
        </section>
    );
}

export default Reviews;