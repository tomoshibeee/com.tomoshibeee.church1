CREATE TABLE IF NOT EXISTS public.m_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL UNIQUE,     -- 'hero', 'products' など BlockType に対応
  name VARCHAR(100) NOT NULL,            -- 表示名（例: "メインビジュアル"）
  description TEXT,                      -- 説明文
  icon VARCHAR(50),                      -- アイコン名
  default_variant VARCHAR(50),          -- デフォルトの variant
  default_data JSONB DEFAULT '{}'::jsonb,-- 初期状態の BlockData
  enabled BOOLEAN DEFAULT true NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'general',
  display_order INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.m_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "m_blocks_allow_all"
  ON public.m_blocks
  FOR ALL
  USING (true);