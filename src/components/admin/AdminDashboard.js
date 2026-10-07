//вкладки и сохранение

import { useEffect, useState } from 'react';
import CollectionEditor from './CollectionEditor';
import { collections } from './schemas';
import { loadContent, saveContent } from '../../lib/contentApi';
import { knives } from '../../data/knives';
import { reviews } from '../../data/reviews';
import { galleryImages } from '../../data/gallery';
import './Admin.css';

const localContent = { knives, reviews, gallery: galleryImages };

function AdminDashboard() {
    const [content, setContent] = useState(localContent);
    const [tab, setTab] = useState('knives');
    const [status, setStatus] = useState('Загрузка…');

    useEffect(() => {
        (async () => {
            try {
                const remote = await loadContent();
                if (remote && (remote.knives?.length || remote.reviews?.length || remote.gallery?.length)) {
                    setContent({
                        knives: remote.knives?.length ? remote.knives : knives,
                        reviews: remote.reviews?.length ? remote.reviews : reviews,
                        gallery: remote.gallery?.length ? remote.gallery : galleryImages,
                    });
                    setStatus('Данные загружены из базы');
                } else {
                    setStatus('База пуста — показаны локальные данные. Сохрани любое изменение, чтобы наполнить базу.');
                }
            } catch {
                setStatus('База недоступна — показаны локальные данные');
            }
        })();
    }, []);

    const update = async (key, list) => {
        const next = { ...content, [key]: list };
        setContent(next);
        try {
            await saveContent(next);
            setStatus('Сохранено ✓ ' + new Date().toLocaleTimeString());
        } catch {
            setStatus('Ошибка сохранения ✗');
        }
    };

    return (
        <div>
            <div className="admin-tabs">
                {Object.entries(collections).map(([key, s]) => (
                    <button key={key} className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>
                        {s.title}
                    </button>
                ))}
            </div>
            <p className="admin-status">{status}</p>
            <CollectionEditor
                schema={collections[tab]}
                items={content[tab]}
                onChange={(list) => update(tab, list)}
            />
        </div>
    );
}

export default AdminDashboard;