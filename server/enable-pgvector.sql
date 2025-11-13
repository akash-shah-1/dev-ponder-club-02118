-- Enable pgvector extension in Neon
-- Run this in your Neon SQL Editor: https://console.neon.tech

CREATE EXTENSION IF NOT EXISTS vector;

-- Verify it's enabled
SELECT * FROM pg_extension WHERE extname = 'vector';

-- You should see a row with extname = 'vector'
-- If you see a result, pgvector is successfully enabled!
