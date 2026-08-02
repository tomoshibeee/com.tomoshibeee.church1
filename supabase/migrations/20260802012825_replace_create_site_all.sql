-- create_site_all: サイト全体を1トランザクションで作成する関数
CREATE OR REPLACE FUNCTION create_site_all(payload jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_site_id uuid;
  v_section jsonb;
  v_section_id uuid;
  v_block jsonb;
  v_s_idx int := 1;
  v_b_idx int := 1;
BEGIN
  -- 1. t_sites にレコード作成
  INSERT INTO t_sites (navigation, updated_at)
  VALUES (
    COALESCE(payload->'navigation'->'menu', '[]'::jsonb),
    NOW()
  )
  RETURNING id INTO v_site_id;

  -- 2. t_site_metas にレコード作成
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
    v_site_id,
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
  );

  -- 3. t_sections & t_blocks の作成
  IF payload->'layout'->'sections' IS NOT NULL THEN
    FOR v_section IN SELECT * FROM jsonb_array_elements(payload->'layout'->'sections')
    LOOP
      v_section_id := COALESCE((v_section->>'id')::uuid, gen_random_uuid());

      -- ★ t_sections への INSERT に data カラムを追加
      INSERT INTO t_sections (
        id,
        site_id,
        type,
        data,           -- ★ 追加
        display_order,
        updated_at
      ) VALUES (
        v_section_id,
        v_site_id,
        v_section->>'type',
        COALESCE(v_section->'data', '{}'::jsonb), -- ★ 追加（nullの場合は空オブジェクト）
        v_s_idx,
        NOW()
      );

      -- 子ブロックのループ挿入
      IF v_section->'blocks' IS NOT NULL THEN
        v_b_idx := 1;
        FOR v_block IN SELECT * FROM jsonb_array_elements(v_section->'blocks')
        LOOP
          INSERT INTO t_blocks (
            id,
            section_id,
            type,
            variant,
            data,
            display_order,
            updated_at
          ) VALUES (
            COALESCE((v_block->>'id')::uuid, gen_random_uuid()),
            v_section_id,
            v_block->>'type',
            COALESCE(v_block->>'variant', ''),
            COALESCE(v_block->'data', '{}'::jsonb),
            v_b_idx,
            NOW()
          );
          v_b_idx := v_b_idx + 1;
        END LOOP;
      END IF;

      v_s_idx := v_s_idx + 1;
    END LOOP;
  END IF;

  RETURN v_site_id;
END;
$$;