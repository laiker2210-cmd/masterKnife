import { useState } from 'react';
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

function MainLayout() {
    const [contactOpen, setContactOpen] = useState(false);
    const [contactKnife, setContactKnife] = useState(null);
    const [page, setPage] = useState('home');

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
                <Catalog knives={knives} onContact={openContact} />
                <About />
                <Gallery />
                <Reviews />
                <Contacts onContact={openContact} />
            </main>
            <Footer />

            {contactOpen && (
                <ContactModal
                    knife={contactKnife}
                    onClose={() => setContactOpen(false)}
                />
            )}
        </>
    );
}

export default MainLayout;