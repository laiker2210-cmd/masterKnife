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
import { NavLinks } from '../../data/NavLinks';
import { knives } from '../../data/knives';
import { reviews as localReviews } from '../../data/reviews';
import { galleryImages as localGallery } from '../../data/gallery';
import { loadContent } from '../../lib/contentApi';

function MainLayout() {
    const [contactOpen, setContactOpen] = useState(false);
    const [contactKnife, setContactKnife] = useState(null);
    const [page, setPage] = useState('home');
    const [content, setContent] = useState({
        knives,
        reviews: localReviews,
        gallery: localGallery,
    });

    useEffect(() => {
        loadContent().then(remote => {
            if (remote && (remote.knives?.length || remote.reviews?.length || remote.gallery?.length)) {
                setContent({
                    knives: remote.knives?.length ? remote.knives : knives,
                    reviews: remote.reviews?.length ? remote.reviews : localReviews,
                    gallery: remote.gallery?.length ? remote.gallery : localGallery,
                });
            }
        }).catch(() => { }); // база недоступна — остаёмся на локальных данных
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
                <Catalog knives={content.knives} onContact={openContact} />
                <About />
                <Gallery images={content.gallery} />
                <Gallery images={content.gallery} />
                <Reviews reviews={content.reviews} />
            </main>
            <Footer />

            {contactOpen && (
                <ContactModal knife={contactKnife} onClose={() => setContactOpen(false)} />
            )}
        </>
    );
}

export default MainLayout;