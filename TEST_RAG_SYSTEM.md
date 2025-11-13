# 🧪 Testing Your RAG System

## ✅ Setup Complete!

Your RAG system is now ready. Here's how to test it:

---

## 📝 Step-by-Step Testing Guide

### **Step 1: Start the Server** (Terminal 1)

```bash
cd server
npm run start:dev
```

Wait for: `Application is running on: http://localhost:3001`

---

### **Step 2: Run Initial Ingestion** (Terminal 2)

You have 2 questions in your database. Let's ingest them:

```bash
# Option A: Using curl (if you have auth token)
curl -X POST "http://localhost:3001/ai/ingest/questions?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Option B: Using the browser/Postman
# POST http://localhost:3001/ai/ingest/questions?limit=10
# Add Authorization header with your Clerk token
```

**Expected Response:**
```json
{
  "total": 2,
  "success": 2,
  "failed": 0,
  "results": []
}
```

---

### **Step 3: Check Embedding Stats**

```bash
# No auth required for stats
curl http://localhost:3001/ai/embeddings/stats
```

**Expected Response:**
```json
{
  "total": 2,
  "byType": [
    {
      "type": "question",
      "count": 2
    }
  ]
}
```

---

### **Step 4: Test the Chatbot**

1. **Start the frontend:**
   ```bash
   cd client
   npm run dev
   ```

2. **Open browser:** http://localhost:3002

3. **Click the purple sparkle button** (bottom-right)

4. **Ask a question similar to your existing ones:**
   - If you have a question about "React auth", ask: "How to implement authentication in React?"
   - If you have a question about "undefined errors", ask: "Why am I getting undefined error?"

5. **Expected Result:**
   ```
   🔍 Found 1-2 Similar Questions:
     1. [Your existing question title] (85% match)
     
   [AI Response that references the similar questions]
   ```

---

## 🎯 Test Scenarios

### **Scenario 1: Similar Question Match**

**Test:** Ask something similar to your existing questions

**What to check:**
- [ ] "Found X Similar Questions" appears
- [ ] Similarity percentage shows (75%+)
- [ ] Question cards are clickable
- [ ] Tags are displayed
- [ ] AI response mentions the similar questions

---

### **Scenario 2: New Question (No Match)**

**Test:** Ask something completely different (e.g., "How to build a blockchain?")

**What to check:**
- [ ] No similar questions shown (or very low similarity <75%)
- [ ] AI still provides a helpful answer
- [ ] Response is general (not context-specific)

---

### **Scenario 3: Add New Question & Auto-Index**

**Test:** Create a new question through the UI

**Steps:**
1. Click "Ask Question"
2. Fill in title, description, category, tags
3. Submit

**What to check:**
- [ ] Question is created successfully
- [ ] Check logs: Should see "Created embedding for question:..."
- [ ] Query stats endpoint - count should increase by 1

---

## 🔍 Debugging

### **Check Server Logs**

Look for these messages:
```
[AiService] Searching for similar questions...
[AiService] Found 2 similar questions
[AiService] Top similarity: 87.5%
[EmbeddingService] Created embedding for question:cmhx9kznt0002intctuj19pc5
```

### **Check Database**

```sql
-- See all embeddings
SELECT "contentType", "contentId", 
       LEFT(content, 50) as preview,
       "createdAt"
FROM ai_embeddings
ORDER BY "createdAt" DESC;

-- Count embeddings
SELECT "contentType", COUNT(*) 
FROM ai_embeddings 
GROUP BY "contentType";
```

### **Common Issues**

**Issue: "No similar questions found" even for similar queries**

**Solution:**
1. Check if embeddings exist: `GET /ai/embeddings/stats`
2. Lower threshold: Change `SIMILARITY_THRESHOLD=0.70` in `.env`
3. Re-ingest: `POST /ai/ingest/questions`

**Issue: "Failed to generate embedding"**

**Solution:**
1. Check Gemini API key is valid
2. Check internet connection
3. Check API quota (free tier limits)
4. Look at server logs for specific error

**Issue: "Vector index not found"**

**Solution:**
```sql
CREATE INDEX ai_embeddings_vector_idx 
ON ai_embeddings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

---

## 📊 Monitoring

### **Check System Health**

```bash
# Embedding stats
curl http://localhost:3001/ai/embeddings/stats

# Test chat (no similar questions expected for this)
curl -X POST http://localhost:3001/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What is React?"}'
```

### **Expected Metrics**

After ingestion:
- ✅ Embeddings: 2 questions
- ✅ Vector search: <500ms
- ✅ AI response: 2-5 seconds
- ✅ Similar questions: 0-2 results (depending on query)

---

## 🚀 Next Steps

Once basic testing works:

1. **Add More Questions**
   - Create 10-20 questions through the UI
   - They'll auto-index
   - Test similarity search improves

2. **Add Answers**
   - Answer some questions
   - Accept answers
   - They'll auto-index too

3. **Fine-tune Threshold**
   - If too many false positives: Increase to 0.80
   - If too few matches: Decrease to 0.70

4. **Monitor Usage**
   - Check logs for similarity scores
   - Track which questions get matched
   - Adjust prompts if needed

---

## 📈 Success Criteria

Your RAG system is working if:

✅ **Embeddings Generated**
- New questions automatically get embeddings
- Check logs: "Created embedding for question:..."

✅ **Vector Search Works**
- Similar questions are found (when they exist)
- Similarity scores are reasonable (0.75-0.95)
- Search completes in <500ms

✅ **AI Uses Context**
- Response mentions similar questions
- Provides context-aware answers
- References previous solutions

✅ **UI Shows Results**
- Similar question cards appear
- Similarity percentages display
- Links work correctly

---

## 🎓 Understanding the Flow

```
User asks: "How to fix undefined error in React?"
           ↓
1. Generate embedding for question
           ↓
2. Search vector DB (cosine similarity)
           ↓
3. Find: "Cannot read property undefined" (92% match)
         "React hooks undefined error" (87% match)
           ↓
4. Build context with similar Q&As
           ↓
5. Send to Gemini with context
           ↓
6. Gemini responds with context-aware answer
           ↓
7. Show similar questions + AI response to user
```

---

## 📞 Need Help?

If something doesn't work:

1. **Check server logs** - Most issues show up there
2. **Verify database** - Run the SQL queries above
3. **Test endpoints** - Use curl/Postman to isolate issues
4. **Check environment** - Ensure all variables are set

---

**Happy Testing! 🎉**

Your RAG system is now learning from your Q&A database and getting smarter with every question!
