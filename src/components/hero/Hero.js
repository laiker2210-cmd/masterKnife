import logo from './headerImg.jpeg';
import './Hero.css';

function Hero() {
    return (
        <section className="App-header">
            <div className="App-header__inner container">
                <img src={logo} className="App-logo" alt="Нож ручной работы" />
                <h1>Мастерская Тайга:<br />ножи ручной работы</h1>
            </div>
            <div className="dev-watermark" aria-hidden="true">
                <span>САЙТ В РАЗРАБОТКЕ</span>
            </div>
        </section>
    );
}

export default Hero;