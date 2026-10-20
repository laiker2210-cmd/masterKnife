-- ============================================================
-- RLS Policies для Мастерская Тайга
-- Выполнить в SQL Editor Supabase Dashboard
-- ============================================================

-- 1. site_content — публичное чтение, запись только аутентифицированным
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Публичное чтение (для frontend)
CREATE POLICY "site_content_public_read"
    ON site_content FOR SELECT
    USING (true);

-- Запись только аутентифицированным (admin)
CREATE POLICY "site_content_admin_write"
    ON site_content FOR UPDATE
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "site_content_admin_insert"
    ON site_content FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- 2. fortune_data — публичное чтение, запись только аутентифицированным
ALTER TABLE fortune_data ENABLE ROW LEVEL SECURITY;

-- Публичное чтение (для frontend + fortune game)
CREATE POLICY "fortune_data_public_read"
    ON fortune_data FOR SELECT
    USING (true);

-- Запись только аутентифицированным
CREATE POLICY "fortune_data_admin_write"
    ON fortune_data FOR UPDATE
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "fortune_data_admin_insert"
    ON fortune_data FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- 3. images (Storage Bucket) — публичное чтение, запись только аутентифицированным
-- Создаём policy для bucket 'images'
CREATE POLICY "images_public_read"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'images');

CREATE POLICY "images_admin_upload"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'images'
        AND auth.uid() IS NOT NULL
    );

CREATE POLICY "images_admin_delete"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'images'
        AND auth.uid() IS NOT NULL
    );
