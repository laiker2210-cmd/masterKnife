import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../nav/Nav';
import Hero from '../hero/Hero';
import Catalog from '../catalog/Catalog';
import About from '../about/About';
import Gallery from '../gallery/Gallery';
import Reviews from '../reviews/Reviews';
import Contacts from '../contacts/Contacts';
import Footer from '../footer/Footer';
import ContactModal from '../contactModal/ContactModal';
import ScrollTop from '../scrolltop/ScrollTop';
import { NavLinks } from '../../data/NavLinks';
import { knives as localKnives } from '../../data/knives';
import { reviews as localReviews } from '../../data/reviews';
import { galleryImages as localGallery } from '../../data/gallery';
import { loadContent } from '../../lib/contentApi';
import './MainLayout.css';

function MainLayout() {
    const navigate = useNavigate();
    const [contactOpen, setContactOpen] = useState(false);
    const [contactKnife, setContactKnife] = useState(null);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState({
        knives: localKnives,
        reviews: localReviews,
        gallery: localGallery,
        watermark: true,
    });

    useEffect(() => {
        let cancelled = false;
        const CACHE_KEY = 'site_content_v1';
        const CACHE_TTL = 5 * 60 * 1000; // 5 минут

        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                const isFresh = Date.now() - (parsed._ts || 0) < CACHE_TTL;
                if (isFresh && (parsed.knives?.length || parsed.reviews?.length || parsed.gallery?.length)) {
                    setContent({
                        knives: parsed.knives?.length ? parsed.knives : localKnives,
                        reviews: parsed.reviews?.length ? parsed.reviews : localReviews,
                        gallery: parsed.gallery?.length ? parsed.gallery : localGallery,
                        watermark: parsed.watermark !== false,
                    });
                    setLoading(false);
                }
            }
        } catch { /* поврежденный кеш — игнорируем */ }

        (async () => {
            try {
                const remote = await loadContent();
                if (cancelled) return;
                if (remote && (remote.knives?.length || remote.reviews?.length || remote.gallery?.length)) {
                    const fresh = {
                        knives: remote.knives?.length ? remote.knives : localKnives,
                        reviews: remote.reviews?.length ? remote.reviews : localReviews,
                        gallery: remote.gallery?.length ? remote.gallery : localGallery,
                        watermark: remote.watermark !== false,
                        _ts: Date.now(),
                    };
                    setContent({
                        knives: fresh.knives,
                        reviews: fresh.reviews,
                        gallery: fresh.gallery,
                        watermark: fresh.watermark,
                    });
                    try { localStorage.setItem(CACHE_KEY, JSON.stringify(fresh)); } catch { }
                }
            } catch {
                // база недоступна
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

    return (
        <>
            <Nav links={NavLinks} onContact={() => openContact()} onFortune={() => navigate('/fortune')} />
            <main id="main-content">
                <Hero hidden={!content.watermark} />
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
