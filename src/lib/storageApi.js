import { supabase } from './supabaseClient';

// Сжимает фото до разумных размеров прямо в браузере перед загрузкой
async function compressImage(file, maxDim = 1600, quality = 0.82) {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale);
    const h = Math.round(bmp.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';           // фон для PNG с прозрачностью
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(bmp, 0, 0, w, h);
    return await new Promise(res => canvas.toBlob(res, 'image/jpeg', quality));
}

export async function uploadImage(file) {
    const blob = await compressImage(file);
    const base = file.name.replace(/\s+/g, '_').replace(/\.[^.]+$/, '');
    const fileName = `${Date.now()}_${base}.jpg`;
    const { error } = await supabase.storage
        .from('images')
        .upload(fileName, blob, { contentType: 'image/jpeg', cacheControl: '3600', upsert: false });
    if (error) throw error;
    const { data } = supabase.storage.from('images').getPublicUrl(fileName);
    return data.publicUrl;
}

export async function deleteImage(fileName) {
    const { error } = await supabase.storage.from('images').remove([fileName]);
    if (error) throw error;
}