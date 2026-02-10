-- =====================================================
-- SCRIPT 21: Tạo bảng Prompt Templates
-- Mục đích: Quản lý prompts động cho AI system
-- =====================================================

-- Tạo ENUM cho prompt types
CREATE TYPE prompt_type AS ENUM (
  'system',           -- System instruction chung
  'medical',          -- Medical diagnosis prompt
  'formatter',        -- JSON formatter prompt
  'clinical',         -- Clinical analysis prompt
  'knowledge',        -- Knowledge base prompt
  'treatment',        -- Treatment recommendation prompt
  'custom'            -- Custom prompt
);

-- Tạo bảng prompt_templates
CREATE TABLE IF NOT EXISTS public.prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Metadata
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE, -- Slug để reference trong code: 'unified-medical-v2'
  description TEXT,
  type prompt_type NOT NULL DEFAULT 'custom',
  
  -- Prompt content
  content TEXT NOT NULL, -- Nội dung prompt (có thể chứa {{variables}})
  variables JSONB DEFAULT '[]'::jsonb, -- Danh sách variables: [{"name": "age", "type": "number", "required": true}]
  
  -- Version control
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT false, -- Chỉ 1 version được active cho mỗi slug
  parent_id UUID REFERENCES public.prompt_templates(id) ON DELETE SET NULL, -- Version trước đó
  
  -- Configuration
  model_config JSONB DEFAULT '{
    "temperature": 0.5,
    "maxTokens": 4000,
    "topP": 1.0,
    "frequencyPenalty": 0.0,
    "presencePenalty": 0.0
  }'::jsonb,
  
  -- Usage tracking
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  
  -- Performance metrics
  avg_tokens_used INTEGER,
  avg_response_time_ms INTEGER,
  success_rate DECIMAL(5,2), -- 0.00 - 100.00
  
  -- Tags for search
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Audit
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_prompt_templates_slug ON public.prompt_templates(slug);
CREATE INDEX idx_prompt_templates_type ON public.prompt_templates(type);
CREATE INDEX idx_prompt_templates_active ON public.prompt_templates(is_active) WHERE is_active = true;
CREATE INDEX idx_prompt_templates_tags ON public.prompt_templates USING gin(tags);
CREATE INDEX idx_prompt_templates_parent ON public.prompt_templates(parent_id);

-- Full-text search
CREATE INDEX idx_prompt_templates_content_search ON public.prompt_templates 
  USING gin(to_tsvector('english', content));

-- Trigger để update updated_at
CREATE TRIGGER update_prompt_templates_updated_at
  BEFORE UPDATE ON public.prompt_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE public.prompt_templates ENABLE ROW LEVEL SECURITY;

-- Admin có thể làm mọi thứ
CREATE POLICY "Admin full access to prompt_templates"
  ON public.prompt_templates
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Authenticated users chỉ có thể đọc active prompts
CREATE POLICY "Users can read active prompts"
  ON public.prompt_templates
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Public có thể đọc active prompts (cho AI system)
CREATE POLICY "Public can read active prompts"
  ON public.prompt_templates
  FOR SELECT
  TO public
  USING (is_active = true);

-- =====================================================
-- SEED DATA: Migrate existing prompts
-- =====================================================

-- 1. Unified Medical Prompt
INSERT INTO public.prompt_templates (
  slug,
  name,
  description,
  type,
  content,
  variables,
  is_active,
  tags,
  model_config
) VALUES (
  'unified-medical-expert',
  'Unified Medical Expert Prompt (Phiên bản chuyên gia)',
  'Prompt chuyên gia cho chẩn đoán y học cổ truyền với Mai Hoa Dịch Số',
  'medical',
  '# VAI TRÒ VÀ NHIỆM VỤ

Bạn là chuyên gia Y học Cổ truyền Việt Nam, tinh thông Mai Hoa Dịch Số (梅花易數), Bát Trạch Minh Cảnh, và Nam Dược Thần Hiệu.

{{patient_info}}
{{hexagram_analysis}}
{{element_relations}}
{{seasonal_analysis}}
{{treatment_recommendations}}

# YÊU CẦU ĐỊNH DẠNG

Trả lời bằng tiếng Việt, dùng thuật ngữ y học cổ truyền chính xác, giải thích rõ ràng và dễ hiểu.',
  '[
    {"name": "patient_info", "type": "string", "required": true, "description": "Thông tin bệnh nhân"},
    {"name": "hexagram_analysis", "type": "string", "required": true, "description": "Phân tích quẻ Mai Hoa"},
    {"name": "element_relations", "type": "string", "required": true, "description": "Quan hệ ngũ hành"},
    {"name": "seasonal_analysis", "type": "string", "required": true, "description": "Phân tích tiết khí"},
    {"name": "treatment_recommendations", "type": "string", "required": false, "description": "Khuyến nghị điều trị"}
  ]'::jsonb,
  true,
  ARRAY['medical', 'mai-hoa', 'tcm', 'diagnosis', 'expert'],
  '{
    "temperature": 0.5,
    "maxTokens": 4000,
    "topP": 1.0
  }'::jsonb
);

-- 2. JSON Formatter Prompt
INSERT INTO public.prompt_templates (
  slug,
  name,
  description,
  type,
  content,
  variables,
  is_active,
  tags,
  model_config
) VALUES (
  'json-formatter',
  'JSON Formatter Prompt',
  'Convert phân tích text sang cấu trúc JSON chuẩn',
  'formatter',
  'Bạn là JSON formatter. Nhiệm vụ của bạn là chuyển đổi text analysis sang JSON format chuẩn.

Input text:
{{input_text}}

Required JSON structure:
{{json_schema}}

QUAN TRỌNG: Chỉ trả về VALID JSON, không có markdown wrapper, không có explanation.',
  '[
    {"name": "input_text", "type": "string", "required": true},
    {"name": "json_schema", "type": "string", "required": true}
  ]'::jsonb,
  true,
  ARRAY['formatter', 'json', 'parser'],
  '{
    "temperature": 0.05,
    "maxTokens": 4000,
    "topP": 1.0
  }'::jsonb
);

-- 3. System Instruction Template
INSERT INTO public.prompt_templates (
  slug,
  name,
  description,
  type,
  content,
  variables,
  is_active,
  tags,
  model_config
) VALUES (
  'system-instruction-base',
  'Base System Instruction',
  'System instruction cơ bản cho tất cả AI calls',
  'system',
  'Bạn là trợ lý AI chuyên về Y học Cổ truyền Việt Nam.

Nguyên tắc:
1. Trả lời bằng tiếng Việt
2. Dùng thuật ngữ y học chính xác
3. Giải thích dễ hiểu cho người dùng
4. Không đưa ra lời khuyên y tế tự ý
5. Khuyến nghị tham khảo bác sĩ khi cần thiết',
  '[]'::jsonb,
  true,
  ARRAY['system', 'base', 'instruction'],
  '{
    "temperature": 0.7,
    "maxTokens": 2000
  }'::jsonb
);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function: Activate prompt version (deactivate others with same slug)
CREATE OR REPLACE FUNCTION activate_prompt_version(prompt_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_slug TEXT;
BEGIN
  -- Get slug of target prompt
  SELECT slug INTO target_slug
  FROM public.prompt_templates
  WHERE id = prompt_id;
  
  -- Deactivate all versions of this slug
  UPDATE public.prompt_templates
  SET is_active = false,
      updated_at = NOW()
  WHERE slug = target_slug;
  
  -- Activate target version
  UPDATE public.prompt_templates
  SET is_active = true,
      updated_at = NOW()
  WHERE id = prompt_id;
END;
$$;

-- Function: Get active prompt by slug
CREATE OR REPLACE FUNCTION get_active_prompt(prompt_slug TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  content TEXT,
  variables JSONB,
  model_config JSONB,
  version INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pt.id,
    pt.name,
    pt.content,
    pt.variables,
    pt.model_config,
    pt.version
  FROM public.prompt_templates pt
  WHERE pt.slug = prompt_slug
    AND pt.is_active = true
  LIMIT 1;
END;
$$;

-- Function: Create new version
CREATE OR REPLACE FUNCTION create_prompt_version(
  base_prompt_id UUID,
  new_content TEXT,
  new_variables JSONB DEFAULT NULL,
  new_model_config JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id UUID;
  base_prompt RECORD;
BEGIN
  -- Get base prompt info
  SELECT * INTO base_prompt
  FROM public.prompt_templates
  WHERE id = base_prompt_id;
  
  -- Create new version
  INSERT INTO public.prompt_templates (
    slug,
    name,
    description,
    type,
    content,
    variables,
    version,
    is_active,
    parent_id,
    model_config,
    tags,
    created_by
  ) VALUES (
    base_prompt.slug,
    base_prompt.name,
    base_prompt.description,
    base_prompt.type,
    new_content,
    COALESCE(new_variables, base_prompt.variables),
    base_prompt.version + 1,
    false,
    base_prompt_id,
    COALESCE(new_model_config, base_prompt.model_config),
    base_prompt.tags,
    auth.uid()
  ) RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION activate_prompt_version TO authenticated;
GRANT EXECUTE ON FUNCTION get_active_prompt TO authenticated, anon;
GRANT EXECUTE ON FUNCTION create_prompt_version TO authenticated;

COMMENT ON TABLE public.prompt_templates IS 'Quản lý prompt templates cho AI system với version control';
COMMENT ON FUNCTION activate_prompt_version IS 'Kích hoạt 1 version prompt (deactivate các version khác)';
COMMENT ON FUNCTION get_active_prompt IS 'Lấy active prompt theo slug';
COMMENT ON FUNCTION create_prompt_version IS 'Tạo version mới từ prompt hiện có';
