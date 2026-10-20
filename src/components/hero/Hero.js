import logo from './headerImg.jpeg';
import './Hero.css';

function Hero({ hidden = false }) {
    const scrollToCatalog = () => {
        document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="App-header">
            <div className="App-header__inner container">
                <img src={logo} className="App-logo" alt="Мастерская Тайга — ножи ручной работы" />
                <h1>Мастерская Тайга:<br />ножи ручной работы</h1>
                <button className="hero__cta" onClick={scrollToCatalog}>
                    Смотреть каталог
                </button>
            </div>
            <div className={`dev-watermark ${hidden ? 'hidden' : ''}`} aria-hidden={hidden}>
                <span>САЙТ В РАЗРАБОТКЕ</span>
            </div>
        </section>
    );
}

export default Hero;
