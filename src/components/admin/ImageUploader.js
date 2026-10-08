import { useState } from 'react';
import { uploadImage, deleteImage } from '../../lib/storageApi';
import './Admin.css';

function ImageUploader(props) {
    const { value, onChange } = props;
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        setError('');
        try {
            const url = await uploadImage(file);
            // удаляем старый файл из Storage, если он там был
            if (value && value.includes('/storage/v1/object/public/images/')) {
                const oldName = decodeURIComponent(value.split('/images/').pop());
                deleteImage(oldName).catch(() => {});
            }
            onChange(url);
        } catch {
            setError('Ошибка загрузки');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="image-uploader">
            {value && (
                <div className="image-uploader__preview">
                    <img src={value} alt="Preview" />
                </div>
            )}
            <div className="image-uploader__controls">
                <label className="btn btn--gold">
                    {uploading ? 'Загрузка...' : '📷 Загрузить фото'}
                    <input type="file" accept="image/*" onChange={handleFile} hidden />
                </label>
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Или вставьте ссылку"
                    className="image-uploader__url"
                />
            </div>
            {error && <p className="image-uploader__error">{error}</p>}
        </div>
    );
}

export default ImageUploader;