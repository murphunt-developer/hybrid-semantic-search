## Client Pain Point(s)
This is a list of client pain points that we want to solve for:
1. We have no search implementation to show customers relavant products
2. We have search, but it doesn't recommend relevant products
3. We have search and it recommends relevant products, but it is slow

## Goal
- We want to dramatically improve customer search quality and response time across all platform interfaces (Web, Mobile, Internal Tools).

## Solution:
- Build a high-performance search widget that combines traditional keyword search (BM25) with AI-powered semantic search (Embeddings), optimized for sub-100ms P99 latency using edge caching and speculative execution.

## Workflow:

### Phase 1: Preparation & Caching
1. Client Query => /search
2. /search => Text-to-Vector Cache (Redis): Check for the exact query string.
    - HIT: Use the cached vector. (Saves API/Inference Cost)
    - MISS: Call the Embedding API, store the new vector, and continue.
3. Vector => Semantic Cache (Redis): Check for semantically similar, previously answered queries.
    - HIT: Use the cached final response/document list. Return results immediately. (Saves entire search latency)
    - MISS: Proceed to the core search logic (Steps 4 & 5).
  
### Phase 2: Core Hybrid Retrieval (The Parallel Step)

Since RRF requires two independent rankings, you run your searches in parallel using the original query text and the generated vector.

4. Run these in parallel:
   - Query 1 (Lexical Search): Use the original query string to query your BM25 Search Database (e.g., Redis, Elasticsearch, or a dedicated index).BM25 Output: A ranked list of Top-K Document IDs and their rank positions (e.g., [Doc A (rank 1), Doc B (rank 2), Doc C (rank 3), ...]).
    - Query 2 (Semantic Search): Use the query vector to query your Main Vector Database.Vector DB Output: A ranked list of Top-K Document IDs and their rank positions based on similarity score (e.g., [Doc C (rank 1), Doc D (rank 2), Doc A (rank 3), ...]).
  
### Phase 3: Fusion and Retrieval

  $$\text{RRF}(d) = \sum_{r \in R} \frac{1}{k + \text{rank}_r(d)}$$

5. Reciprocal Rank Fusion (RRF): 
    - Your application takes the two independent ranked lists (from Step 4 and Step 5) and applies the RRF formula to combine them into a single, unified ranked list of unique document IDs.
    - $d$ is a document (or document chunk ID).
    - $R$ is the set of rankers (BM25 and Vector Search).
    - $k$ is a constant (typically 60) to prevent a rank of 1 from dominating the score.
    - $\text{rank}_r(d)$ is the position of document $d$ in the ranked list $r$.

6. SOT Retrieval: Take the final Top-N list of document IDs produced by RRF and use them to query your Source of Truth (SOT) Database to retrieve the full, authoritative text.
7. Final Output: Return the full documents to the client, or feed them to an LLM (in a RAG pipeline) to generate a final answer.

## Backend

### APIs

#### Public Endpoints
- /search?keywords=k1,k2,k3,...kn
  - Inputs: query
  - Outputs: list of products

#### Private Methods
- BM25 Search
  - Inputs: query
  - Outputs: list of products
- AI Semantic Search
  - Inputs: query
  - Outputs: list of products
- Semantic Search Get 
  - Inputs: vector embedding
  - Outputs: list of products
- Semantic Search Put
  - Inputs: vector embedding
  - Output: boolean
- Vector embedding
  - Inputs: query
  - Output: vector embedding
- Vector Database Get
  - Inputs: vector embedding
  - Output:
- SOT Database Get
  - Inputs: document_id
  - Output: product
- RRF
  - Inputs: products_1, products_2
  - Outputs: products_3


### Databases

#### Text to Vector Cache 
- Goal:
  - Avoid expensive calls to embedding API for queries
- Storage:
  - simple fast key/value store (e.g. Redis) 
- Schema:
  - query
  - vector
- Logic: 
  - user query
  - check for that exact string (with some small pre-processing like lowercaes, commas, etc.)
  - hit, use that vector for semantic cache similiarty
  - miss, call API to generate the embedding for this new query 

#### Semantic Cache
- Goal:
  - Check cosine similiarty and skip vector search
- Storage:
  - simple fast key/value store (e.g. Redis) 
- Schema: 
  - vector
  - products
- Logic:
  - user query
  - check for vector embedding nearest neighbor
  - hit, return this list of products
  - miss, call vector search on source of truth 

#### Main Vector Database
- Goal:
  - holds embedding representation of your entire knowledge corpus
- Storage
  - Firestore
- Schema:
  - document_id (the foreign key that makes the entire system work)
  - document_vector
  - metadata
- Logic:

#### BM25 Search Database
- Goal:
  - holds search 
- Storage
  - Firestore
- Schema:
  - document_id (the foreign key that makes the entire system work)
  - document_vector
  - metadata
- Logic:

#### Source of Truth (SOT) Database
- Goal:
  - store the actual product data
- Storage:
  - Firestore
- Schema:
  - document_id
  - product_data
- Logic:
  - document_id is pulled from the main vector database and used to query this database

### Metrics
#### BM25
- Full Call Latency
- Cache Latency

#### AI Semantic Search
- Full Call Latency
- Cache Latency

## Frontend


## Test Data

