-- ═══════════════════════════════════════════════════════════════════════════
-- MIGRATION: Tạo bảng knowledge_documents để quản lý tài liệu kiến thức AI
-- ═══════════════════════════════════════════════════════════════════════════
-- Mục đích: Lưu trữ tài liệu y học Đông y để AI truy xuất khi phân tích
-- Vector search: Supabase hỗ trợ pgvector extension để RAG (Retrieval-Augmented Generation)

-- Enable vector extension nếu chưa có
CREATE EXTENSION IF NOT EXISTS vector;

-- Bảng chính: knowledge_documents
CREATE TABLE IF NOT EXISTS public.knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('mai-hoa', 'nam-duoc', 'bat-trach', 'khai-huyet', 'general')),
  subcategory TEXT, -- VD: 'trigram-can', 'herb-catalog', 'symptom-dau-dau'
  tags TEXT[], -- VD: ['gan', 'mắt', 'đau đầu']
  file_name TEXT,
  file_type TEXT, -- 'md', 'txt', 'pdf'
  
  -- Vector embedding cho semantic search (sử dụng OpenAI ada-002 - 1536 dimensions)
  embedding vector(1536),
  
  -- Metadata
  upload_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  relevance_score INTEGER DEFAULT 0, -- Admin có thể đánh giá chất lượng tài liệu
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index cho tìm kiếm nhanh
CREATE INDEX IF NOT EXISTS idx_knowledge_category ON public.knowledge_documents(category);
CREATE INDEX IF NOT EXISTS idx_knowledge_tags ON public.knowledge_documents USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_knowledge_active ON public.knowledge_documents(is_active) WHERE is_active = true;

-- Vector similarity search index (HNSW - Hierarchical Navigable Small World)
CREATE INDEX IF NOT EXISTS idx_knowledge_embedding ON public.knowledge_documents USING hnsw (embedding vector_cosine_ops);

-- Full text search index (cho trường hợp không dùng embedding)
ALTER TABLE public.knowledge_documents ADD COLUMN IF NOT EXISTS search_vector tsvector 
  GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(content, '')), 'B')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_knowledge_fts ON public.knowledge_documents USING GIN(search_vector);

-- Trigger tự động update updated_at
CREATE OR REPLACE FUNCTION update_knowledge_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_knowledge_documents_updated_at
  BEFORE UPDATE ON public.knowledge_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_knowledge_documents_updated_at();

-- RLS Policies
ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;

-- Admin có thể làm mọi thứ
CREATE POLICY "Admin full access to knowledge documents"
  ON public.knowledge_documents
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Người dùng thường chỉ đọc tài liệu active
CREATE POLICY "Users can view active knowledge documents"
  ON public.knowledge_documents
  FOR SELECT
  USING (is_active = true);

-- ═══════════════════════════════════════════════════════════════════════════
-- FUNCTION: Semantic search với vector similarity
-- ═══════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION search_knowledge_documents(
  query_embedding vector(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5,
  filter_category TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  category TEXT,
  subcategory TEXT,
  tags TEXT[],
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kd.id,
    kd.title,
    kd.content,
    kd.category,
    kd.subcategory,
    kd.tags,
    1 - (kd.embedding <=> query_embedding) AS similarity
  FROM public.knowledge_documents kd
  WHERE kd.is_active = true
    AND (filter_category IS NULL OR kd.category = filter_category)
    AND 1 - (kd.embedding <=> query_embedding) > match_threshold
  ORDER BY kd.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED DATA: Import kiến thức hiện tại từ file .md vào database
-- ═══════════════════════════════════════════════════════════════════════════
-- Lưu ý: Embedding sẽ được generate sau qua API route /api/admin/knowledge/generate-embeddings

INSERT INTO public.knowledge_documents (title, content, category, subcategory, tags, file_name, file_type, is_active)
VALUES
  ('Mai Hoa Core Logic', '[Nội dung sẽ được import từ mai-hoa-core.md]', 'mai-hoa', 'core-logic', ARRAY['quẻ', 'ngũ hành', 'chẩn đoán'], 'mai-hoa-core.md', 'md', true),
  ('Anthropometric Rules', '[Nội dung sẽ được import từ anthropometric-rules.md]', 'mai-hoa', 'anthropometric', ARRAY['nhân trắc học', 'cơ thể'], 'anthropometric-rules.md', 'md', true),
  ('Nam Dược Thần Hiệu', '[Nội dung sẽ được import từ nam-duoc-than-hieu.md]', 'nam-duoc', 'herb-catalog', ARRAY['thuốc nam', 'ngũ hành', 'dược liệu'], 'nam-duoc-than-hieu.md', 'md', true),
  ('Bát Trạch Minh Cảnh', '[Nội dung sẽ được import từ bat-trach-minh-canh.md]', 'bat-trach', 'core-logic', ARRAY['tướng số', 'bát quái', 'bát trạch'], 'bat-trach-minh-canh.md', 'md', true),
  ('Khai Huyệt Cẩm Nang', '[Nội dung sẽ được import từ khai-huyet-cam-nang.md]', 'khai-huyet', 'acupoint-guide', ARRAY['huyệt đạo', 'bấm huyệt', 'kinh lạc'], 'khai-huyet-cam-nang.md', 'md', true),
  ('Symptom Analysis', '[Nội dung sẽ được import từ symptom-analysis.md]', 'mai-hoa', 'symptom-guide', ARRAY['triệu chứng', 'chẩn đoán'], 'symptom-analysis.md', 'md', true)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE public.knowledge_documents IS 'Tài liệu kiến thức y học Đông y cho AI - hỗ trợ RAG (Retrieval-Augmented Generation)';
COMMENT ON COLUMN public.knowledge_documents.embedding IS 'Vector embedding 1536-dim từ OpenAI text-embedding-ada-002';
COMMENT ON COLUMN public.knowledge_documents.relevance_score IS 'Admin đánh giá (0-100) - tài liệu càng hữu ích càng cao điểm';
