import { supabase } from './supabaseClient';

export async function loadContent() {
    const { data, error } = await supabase
        .from('site_content')
        .select('data')
        .eq('id', 1)
        .maybeSingle();
    if (error) throw error;
    return data?.data || null;
}

export async function saveContent(content) {
    const { error } = await supabase
        .from('site_content')
        .update({ data: content, updated_at: new Date().toISOString() })
        .eq('id', 1);
    if (error) throw error;
}

export async function loadFortune() {
    const { data, error } = await supabase
        .from('fortune_data')
        .select('data')
        .eq('id', 1)
        .maybeSingle();
    if (error) {
        console.error('[contentApi] loadFortune error:', error);
        throw error;
    }
    // data — строка из БД: {data: {...}, updated_at: ...}
    // data?.data — JSON-поле. Может быть объектом (JSONB) или строкой (text)
    const raw = data?.data;
    if (typeof raw === 'string') {
        try {
            return JSON.parse(raw);
        } catch {
            console.error('[contentApi] loadFortune JSON parse error:', raw);
            return null;
        }
    }
    return raw || null;
}

export async function saveFortune(data) {
    const { error } = await supabase
        .from('fortune_data')
        .update({ data, updated_at: new Date().toISOString() })
        .eq('id', 1);
    if (error) throw error;
}
