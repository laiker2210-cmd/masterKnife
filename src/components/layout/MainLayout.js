import { useEffect, useState } from 'react';
import Nav from '../nav/Nav';
import Hero from '../hero/Hero';
import Catalog from '../catalog/Catalog';
import About from '../about/About';
import Gallery from '../gallery/Gallery';
import Reviews from '../reviews/Reviews';
import Contacts from '../contacts/Contacts';
import Footer from '../footer/Footer';
import ContactModal from '../contactModal/ContactModal';
import Fortune from '../fortune/Fortune';
import ScrollTop from '../scrolltop/ScrollTop';
import { NavLinks } from '../../data/NavLinks';
import { knives as localKnives } from '../../data/knives';
import { reviews as localReviews } from '../../data/reviews';
import { galleryImages as localGallery } from '../../data/gallery';
import { loadContent } from '../../lib/contentApi';
import './MainLayout.css';

function MainLayout() {
    const [contactOpen, setContactOpen] = useState(false);
    const [contactKnife, setContactKnife] = useState(null);
    const [page, setPage] = useState('home');
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState({
        knives: localKnives,
        reviews: localReviews,
        gallery: localGallery,
    });

    useEffect(() => {
        let cancelled = false;
        const CACHE_KEY = 'site_content_v1';

        // 1. Мгновенно показываем кеш из sessionStorage, если есть
        try {
            const cached = sessionStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (parsed.knives?.length || parsed.reviews?.length || parsed.gallery?.length) {
                    setContent({
                        knives: parsed.knives?.length ? parsed.knives : localKnives,
                        reviews: parsed.reviews?.length ? parsed.reviews : localReviews,
                        gallery: parsed.gallery?.length ? parsed.gallery : localGallery,
                    });
                    setLoading(false); // не показываем скелетон, есть кеш
                }
            }
        } catch { /* поврежденный кеш — игнорируем */ }

        // 2. Параллельно тянем свежие данные
        (async () => {
            try {
                const remote = await loadContent();
                if (cancelled) return;
                if (remote && (remote.knives?.length || remote.reviews?.length || remote.gallery?.length)) {
                    const fresh = {
                        knives: remote.knives?.length ? remote.knives : localKnives,
                        reviews: remote.reviews?.length ? remote.reviews : localReviews,
                        gallery: remote.gallery?.length ? remote.gallery : localGallery,
                    };
                    setContent(fresh);
                    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(remote)); } catch { }
                }
            } catch {
                // база недоступна — если кеша нет, loading уже false и показаны локальные
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, []);

    const openContact = (knife = null) => {
        setContactKnife(knife);
        setContactOpen(true);
    };

    if (page === 'fortune') {
        return <Fortune onBack={() => setPage('home')} />;
    }

    return (
        <>
            <Nav links={NavLinks} onContact={() => openContact()} onFortune={() => setPage('fortune')} />
            <main>
                <Hero />
                {loading ? (
                    <Skeleton />
                ) : (
                    <>
                        <Catalog knives={content.knives} onContact={openContact} />
                        <About />
                        <Gallery images={content.gallery} />
                        <Reviews reviews={content.reviews} />
                    </>
                )}
                <Contacts onContact={openContact} />
            </main>
            <Footer />
            <ScrollTop/>

            {contactOpen && (
                <ContactModal knife={contactKnife} onClose={() => setContactOpen(false)} />
            )}
        </>
    );
}

/* Скелетон — серый «призрак» секций, пока грузятся данные */
function Skeleton() {
    return (
        <div className="skeleton">
            <section className="skeleton__catalog container">
                <div className="skeleton__title" />
                <div className="skeleton__grid">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="skeleton__card">
                            <div className="skeleton__image" />
                            <div className="skeleton__line" />
                            <div className="skeleton__line short" />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default MainLayout;