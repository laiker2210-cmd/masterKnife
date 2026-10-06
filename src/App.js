import { useState } from 'react';
import Nav from './components/nav/Nav';
import Hero from './components/hero/Hero';
import About from './components/about/About';
import Catalog from './components/catalog/Catalog';
import Gallery from './components/gallery/Gallery';
import Reviews from './components/reviews/Reviews';
import Contacts from './components/contacts/Contacts';
import Footer from './components/footer/Footer';
import ScrollTop from './components/scrolltop/ScrollTop';
import ContactModal from './components/contactModal/ContactModal';
import { NavLinks } from './data/NavLinks';
import { knives } from './data/knives';
import './App.css';

function App() {
    const [contactOpen, setContactOpen] = useState(false);
    const [contactKnife, setContactKnife] = useState(null); // нож, о котором спрашивают

    const openContact = (knife = null) => {
        setContactKnife(knife);
        setContactOpen(true);
    };

    return (
        <>
            <Nav links={NavLinks} onContact={() => openContact()} />
            <main>
                <Hero />
                <Catalog knives={knives} onContact={openContact} />
                <About />
                <Gallery />
                <Reviews/>
                <Contacts onContact={openContact} />
                <Footer/>
                <ScrollTop/>
            </main>

            {contactOpen && (
                <ContactModal
                    knife={contactKnife}
                    onClose={() => setContactOpen(false)}
                />
            )}
        </>
    );
}

export default App;