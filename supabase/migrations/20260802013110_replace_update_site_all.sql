-- update_site_all: サイト全体を1トランザクションで安全に更新（保存）する関数
CREATE OR REPLACE FUNCTION update_site_all(
  p_site_id uuid,
  payload jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_section jsonb;
  v_section_id uuid;
  v_block jsonb;
  v_s_idx int := 1;
  v_b_idx int := 1;
  v_active_section_ids uuid[] := ARRAY[]::uuid[];
  v_active_block_ids uuid[] := ARRAY[]::uuid[];
BEGIN
  -- 1. t_sites の更新
  UPDATE t_sites
  SET 
    navigation = COALESCE(payload->'navigation'->'menu', '[]'::jsonb),
    updated_at = NOW()
  WHERE id = p_site_id;

  -- 2. t_site_metas の更新 (upsert)
  INSERT INTO t_site_metas (
    site_id,
    name,
    slug,
    description,
    tel,
    email,
    postal_code,
    address,
    building,
    access,
    background_image,
    avatar,
    updated_at
  ) VALUES (
    p_site_id,
    payload->'meta'->>'name',
    payload->'meta'->>'slug',
    payload->'meta'->>'description',
    COALESCE(payload->'meta'->>'tel', ''),
    COALESCE(payload->'meta'->>'email', ''),
    COALESCE(payload->'meta'->>'postalCode', ''),
    COALESCE(payload->'meta'->>'address', ''),
    COALESCE(payload->'meta'->>'bldg', ''),
    COALESCE(payload->'meta'->>'access', ''),
    COALESCE(payload->'meta'->>'background_image', ''),
    COALESCE(payload->'meta'->>'avatar', ''),
    NOW()
  )
  ON CONFLICT (site_id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    tel = EXCLUDED.tel,
    email = EXCLUDED.email,
    postal_code = EXCLUDED.postal_code,
    address = EXCLUDED.address,
    building = EXCLUDED.building,
    access = EXCLUDED.access,
    background_image = EXCLUDED.background_image,
    avatar = EXCLUDED.avatar,
    updated_at = NOW();

  -- 3. layout.sections と t_blocks の差分処理
  IF payload->'layout'->'sections' IS NOT NULL THEN

    -- 画面上に存在する Section ID と Block ID のリストを集計
    FOR v_section IN SELECT * FROM jsonb_array_elements(payload->'layout'->'sections')
    LOOP
      IF v_section->>'id' IS NOT NULL THEN
        v_active_section_ids := array_append(v_active_section_ids, (v_section->>'id')::uuid);
      END IF;

      IF v_section->'blocks' IS NOT NULL THEN
        FOR v_block IN SELECT * FROM jsonb_array_elements(v_section->'blocks')
        LOOP
          IF v_block->>'id' IS NOT NULL THEN
            v_active_block_ids := array_append(v_active_block_ids, (v_block->>'id')::uuid);
          END IF;
        END LOOP;
      END IF;
    END LOOP;

    --------------------------------------------------
    -- 差分削除（FK制約を守るため、子:t_blocks ➔ 親:t_sections の順で削除）
    --------------------------------------------------
    -- A. 削除されたブロックを消す
    DELETE FROM t_blocks
    WHERE section_id IN (SELECT id FROM t_sections WHERE site_id = p_site_id)
      AND (array_length(v_active_block_ids, 1) IS NULL OR id NOT IN (SELECT unnest(v_active_block_ids)));

    -- B. 削除されたセクションを消す
    DELETE FROM t_sections
    WHERE site_id = p_site_id
      AND (array_length(v_active_section_ids, 1) IS NULL OR id NOT IN (SELECT unnest(v_active_section_ids)));

    --------------------------------------------------
    -- 追加・更新（親:t_sections ➔ 子:t_blocks の順で Upsert）
    --------------------------------------------------
    FOR v_section IN SELECT * FROM jsonb_array_elements(payload->'layout'->'sections')
    LOOP
      v_section_id := COALESCE((v_section->>'id')::uuid, gen_random_uuid());

      -- セクションの upsert
      INSERT INTO t_sections (
        id,
        site_id,
        type,
        data,          -- ★ 追加
        display_order,
        updated_at
      )
      VALUES (
        v_section_id,
        p_site_id,
        v_section->>'type',
        COALESCE(v_section->'data', '{}'::jsonb), -- ★ 追加（nullの場合は空オブジェクト）
        v_s_idx,
        NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        type = EXCLUDED.type,
        data = EXCLUDED.data,                     -- ★ 追加（既存セクションの更新時にも反映）
        display_order = EXCLUDED.display_order,
        updated_at = NOW();

      -- ブロックの upsert
      IF v_section->'blocks' IS NOT NULL THEN
        v_b_idx := 1;
        FOR v_block IN SELECT * FROM jsonb_array_elements(v_section->'blocks')
        LOOP
          INSERT INTO t_blocks (id, section_id, type, variant, data, display_order, updated_at)
          VALUES (
            COALESCE((v_block->>'id')::uuid, gen_random_uuid()),
            v_section_id,
            v_block->>'type',
            COALESCE(v_block->>'variant', ''),
            COALESCE(v_block->'data', '{}'::jsonb),
            v_b_idx,
            NOW()
          )
          ON CONFLICT (id) DO UPDATE SET
            section_id = EXCLUDED.section_id,
            type = EXCLUDED.type,
            variant = EXCLUDED.variant,
            data = EXCLUDED.data,
            display_order = EXCLUDED.display_order,
            updated_at = NOW();

          v_b_idx := v_b_idx + 1;
        END LOOP;
      END IF;

      v_s_idx := v_s_idx + 1;
    END LOOP;

  END IF;

END;
$$;