//универсальная форма

import { useState } from 'react';
import ImageUploader from './ImageUploader';
import './Admin.css';

const specsToText = (specs) =>
    Object.entries(specs || {}).map(([k, v]) => `${k}: ${v}`).join('\n');

const textToSpecs = (text) => {
    const out = {};
    (text || '').split('\n').forEach(line => {
        const i = line.indexOf(':');
        if (i > 0) out[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    });
    return out;
};

function CollectionEditor(props) {
    const { schema, items, onChange } = props;
    const [editing, setEditing] = useState(null); // индекс или 'new'
    const [draft, setDraft] = useState(null);

    const startEdit = (index) => {
        const item = items[index];
        setDraft({ ...item, specsText: specsToText(item.specs) });
        setEditing(index);
    };

    const startNew = () => {
        setDraft({ ...schema.blank(), specsText: '' });
        setEditing('new');
    };

    const setField = (key, value) => setDraft(d => ({ ...d, [key]: value }));

    const save = () => {
        const { specsText, ...rest } = draft;
        const ready = schema.fields.some(f => f.type === 'pairs')
            ? { ...rest, specs: textToSpecs(specsText) }
            : rest;
        if (ready.rating !== undefined) ready.rating = Math.min(5, Math.max(1, Number(ready.rating) || 5));
        onChange(editing === 'new' ? [...items, ready] : items.map((it, i) => (i === editing ? ready : it)));
        setEditing(null);
        setDraft(null);
    };

    const remove = (index) => {
        if (!window.confirm('Удалить элемент?')) return;
        onChange(items.filter((_, i) => i !== index));
        if (editing === index) setEditing(null);
    };

    if (editing !== null) {
        return (
            <div className="admin-form">
                <h3>{editing === 'new' ? 'Новый элемент' : 'Редактирование'}</h3>
                {schema.fields.map(f => (
                    <label key={f.key} className="admin-field">
                        <span>{f.label}</span>
                        {f.type === 'text' && (
                            <input value={draft[f.key] ?? ''} onChange={e => setField(f.key, e.target.value)} />
                        )}
                        {f.type === 'textarea' && (
                            <textarea rows={4} value={draft[f.key] ?? ''} onChange={e => setField(f.key, e.target.value)} />
                        )}
                        {f.type === 'pairs' && (
                            <textarea rows={6} value={draft.specsText ?? ''}
                                onChange={e => setField('specsText', e.target.value)}
                                placeholder={'Сталь: Х12МФ\nДлина клинка: 145 мм'} />
                        )}
                        {f.type === 'image' && (
                            <ImageUploader
                                value={draft[f.key] ?? ''}
                                onChange={(url) => setField(f.key, url)}
                            />
                        )}
                    </label>
                ))}
                <div className="admin-form__row">
                    <button className="btn btn--gold" onClick={save}>Сохранить</button>
                    <button className="btn" onClick={() => setEditing(null)}>Отмена</button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-list">
            {items.map((item, i) => (
                <div key={item.id ?? i} className="admin-item">
                    <span>{schema.preview(item)}</span>
                    <span>
                        <button className="btn" onClick={() => startEdit(i)}>✏️ Изменить</button>
                        <button className="btn btn--red" onClick={() => remove(i)}>🗑</button>
                    </span>
                </div>
            ))}
            <button className="btn btn--gold" onClick={startNew}>+ Добавить</button>
        </div>
    );
}

export default CollectionEditor;