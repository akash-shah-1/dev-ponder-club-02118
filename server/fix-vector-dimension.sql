-- Fix vector dimension from 1536 (OpenAI) to 768 (Gemini)
ALTER TABLE ai_embeddings ALTER COLUMN embedding TYPE vector(768);

-- Recreate the index with correct dimension
DROP INDEX IF EXISTS ai_embeddings_vector_idx;
CREATE INDEX ai_embeddings_vector_idx 
ON ai_embeddings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
