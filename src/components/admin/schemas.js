//описание форм

export const collections = {
    knives: {
        title: 'Ножи',
        preview: (i) => `${i.name} — ${i.price}`,
        blank: () => ({ id: Date.now(), name: 'Новый нож', status: 'В наличии', price: '', short: '', image: '', specs: {}, description: '' }),
        fields: [
            { key: 'name', label: 'Название', type: 'text' },
            { key: 'status', label: 'Статус', type: 'text' },
            { key: 'price', label: 'Цена', type: 'text' },
            { key: 'image', label: 'Фото', type: 'image' },  // ← было 'text'
            { key: 'short', label: 'Короткое описание (в карточке)', type: 'textarea' },
            { key: 'specs', label: 'Характеристики (по одной на строку, «Параметр: значение»)', type: 'pairs' },
            { key: 'description', label: 'Полное описание', type: 'textarea' },
        ],
    },
    reviews: {
        title: 'Отзывы',
        preview: (i) => `${i.author} — ${i.knife}`,
        blank: () => ({ id: Date.now(), author: '', date: '', knife: '', rating: 5, text: '' }),
        fields: [
            { key: 'author', label: 'Автор', type: 'text' },
            { key: 'date', label: 'Дата (например «март 2026»)', type: 'text' },
            { key: 'knife', label: 'Нож', type: 'text' },
            { key: 'rating', label: 'Оценка (1–5)', type: 'text' },
            { key: 'text', label: 'Текст отзыва', type: 'textarea' },
        ],
    },
    gallery: {
        title: 'Галерея',
        preview: (i) => i.alt || i.src,
        blank: () => ({ id: Date.now(), src: '', alt: '' }),
        fields: [
            { key: 'src', label: 'Фото', type: 'image' },  // ← было 'text'
            { key: 'alt', label: 'Подпись (alt)', type: 'text' },
        ],
    },
};