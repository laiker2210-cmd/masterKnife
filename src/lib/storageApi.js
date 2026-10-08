import { supabase } from './supabaseClient';

export async function uploadImage(file) {
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const { error } = await supabase.storage
        .from('images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (error) throw error;
    const { data } = supabase.storage.from('images').getPublicUrl(fileName);
    return data.publicUrl;
}

export async function deleteImage(fileName) {
    const { error } = await supabase.storage.from('images').remove([fileName]);
    if (error) throw error;
}