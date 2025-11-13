-- Enable pgvector extension for Neon
CREATE EXTENSION IF NOT EXISTS vector;

-- Add AI fields to answers table
ALTER TABLE answers 
ADD COLUMN IF NOT EXISTS "isAiGenerated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "aiModel" TEXT,
ADD COLUMN IF NOT EXISTS "aiConfidence" DOUBLE PRECISION;

-- Create ai_queries table
CREATE TABLE IF NOT EXISTS ai_queries (
  id TEXT PRIMARY KEY,
  "questionId" TEXT NOT NULL,
  "userId" TEXT,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  model TEXT NOT NULL,
  "tokensUsed" INTEGER NOT NULL,
  confidence DOUBLE PRECISION,
  "wasHelpful" BOOLEAN,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create ai_embeddings table
CREATE TABLE IF NOT EXISTS ai_embeddings (
  id TEXT PRIMARY KEY,
  "contentType" TEXT NOT NULL,
  "contentId" TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  UNIQUE("contentType", "contentId")
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_queries_question ON ai_queries("questionId");
CREATE INDEX IF NOT EXISTS idx_ai_queries_user ON ai_queries("userId");
CREATE INDEX IF NOT EXISTS idx_ai_embeddings_type ON ai_embeddings("contentType");
CREATE INDEX IF NOT EXISTS idx_ai_embeddings_content ON ai_embeddings("contentId");

-- Create vector similarity search index (for production)
-- CREATE INDEX IF NOT EXISTS idx_ai_embeddings_vector ON ai_embeddings 
-- USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Add comment
COMMENT ON TABLE ai_queries IS 'Stores all AI query interactions for learning and analytics';
COMMENT ON TABLE ai_embeddings IS 'Stores vector embeddings for semantic search';
