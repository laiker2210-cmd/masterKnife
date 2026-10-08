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