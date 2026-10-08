// Приводит пути фото к рабочим и на localhost, и на GitHub Pages (basename /masterKnife)
export const resolveImage = (src) => {
    if (!src) return '';
    if (/^https?:\/\//.test(src)) return src; // Supabase Storage и любые внешние ссылки
    return `${process.env.PUBLIC_URL}${src.startsWith('/') ? src : '/' + src}`;
};

export default resolveImage;