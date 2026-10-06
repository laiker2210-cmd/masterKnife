import { useEffect, useState } from 'react';
import './ScrollTop.css';

function ScrollTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            //кнопка появляется после 400px прокрутки вниз
            setVisible(window.scrollY > 400);
        };

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            className={`scroll-top ${visible ? 'scroll-top--visible' : ''}`}
            onClick={scrollToTop}
            aria-label="Наверх"
        >
            ↑
        </button>
    );
}

export default ScrollTop;