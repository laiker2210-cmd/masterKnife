import { useEffect, useRef, useState } from 'react';
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
    const [loading, setLoading] = useState(true);
    const contentRef = useRef(localContent); // зеркало актуального контента

    useEffect(() => {
        (async () => {
            try {
                const remote = await loadContent();
                if (remote && (remote.knives?.length || remote.reviews?.length || remote.gallery?.length)) {
                    const next = {
                        knives: remote.knives?.length ? remote.knives : knives,
                        reviews: remote.reviews?.length ? remote.reviews : reviews,
                        gallery: remote.gallery?.length ? remote.gallery : galleryImages,
                    };
                    contentRef.current = next;
                    setContent(next);
                    setStatus('Данные загружены из базы');
                } else {
                    setStatus('База пуста — показаны локальные данные. Сохрани любое изменение, чтобы наполнить базу.');
                }
            } catch {
                setStatus('База недоступна — показаны локальные данные');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const update = async (key, list) => {
        const next = { ...contentRef.current, [key]: list };
        contentRef.current = next;   // зеркало обновляем СРАЗУ, не ждём рендер
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
            {loading ? (
                <p>Загрузка данных…</p>
            ) : (
                <CollectionEditor
                    schema={collections[tab]}
                    items={content[tab]}
                    onChange={(list) => update(tab, list)}
                />
            )}
        </div>
    );
}

export default AdminDashboard;