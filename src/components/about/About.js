import './About.css';

function About() {
    return (
        <section className="about " id="about">
            <div className="about__inner container">
                <h2 className="about__title">О мастерской</h2>

                <div className="about__block about__block--left">
                    <img
                        src="/images/about/forge.jpg"
                        alt="Нож на подставке"
                        className="about__image"
                    />
                    <p>
                        Мы работаем с проверенными кузнецами и заказываем материалы
                        у профессионалов. Каждая заготовка проходит полную термическую
                        обработку, закалку и все необходимые этапы — чтобы нож служил
                        годами и держал заточку.
                    </p>
                </div>

                <div className="about__block about__block--right">
                    <img
                        src="/images/about/forge3.jpg"
                        alt="Нож на подставке"
                        className="about__image"
                    />
                    <p>
                        Рукоять, больстер, клинок — всё подбирается индивидуально.
                        Даже если сталь одна и та же, двух одинаковых ножей не бывает:
                        разная текстура дерева, разная заточка, разный характер.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default About;