//общий доступ к данным

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY;
const TABLE = 'site_content';

const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
};

export async function loadContent() {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?id=eq.1`, { headers });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const rows = await r.json();
    return rows[0]?.data || null;
}

export async function saveContent(data) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?id=eq.1`, {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ data }),
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
}