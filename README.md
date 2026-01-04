## NEXUS: Hybrid Semantic Search with Predictive Latency Optimization

## Project Overview

Nexus is a high-performance, full-stack search widget that demonstrates expertise in low-latency system design and scalable AI integration. It combines traditional keyword search with Google Vertex AI semantic search, optimized for high throughput using a specialized semantic caching layer and Reciprocal Rank Fusion (RRF).

## Core Technical Achievements

|Achievement | Technical Detail | Rationale (Why it Matters) |
|---|---|---|
| P99 Latency Optimization | Implemented a Semantic Caching Layer (Redis) using vector similarity to serve near-identical queries from the cache, reducing P99 latency by >90% compared to re-running full inference. | Demonstrates ability to optimize AI Inference Serving—a critical challenge at Google scale.|
| High-Quality Retrieval | Engineered a Hybrid Search Pipeline leveraging the Vector Database (pgvector) to run parallel Keyword Search and Semantic Search, fused using the RRF algorithm. | Shows understanding that real-world accuracy requires combining fast traditional methods with modern AI. |
| Full-Stack Performance | Built a responsive JavaScript/React Widget featuring optimistic UI updates and a speculative debouncing strategy, minimizing API calls while preserving a sub-100ms user experience. | Leverages your frontend/widget experience and demonstrates end-to-end performance ownership. |
| Scalable Infrastructure | Containerized the service using Docker and deployed to Google Cloud Run, configured for automatic scaling to handle 10,000+ RPS load tested using a custom Python script. | Proves expertise in building and deploying robust, cost-efficient, cloud-native services. |

## Technology Stack

- Frontend: React, JavaScript, Tailwind CSS
- Backend/Middleware: Node.js / JavaScript, Express
- AI/Embeddings: Google Vertex AI (text-embedding-gecko model)
- Database: PostgreSQL with pgvector extension
- Caching: Redis
- Deployment: Docker, Google Cloud Run

## Architecture & Data Flow

(Link to docs/ARCHITECTURE.md here)

Request Initiation: 
  - User types in the React widget. useStreamingSearch.ts handles debouncing and sends the query.

Caching Gateway: 
  - The Node.js service first checks the Semantic Cache (Redis) for any queries with high vector similarity (cosine_similarity>0.95). If a hit, return the cached result immediately.

Parallel Search: 
  - If a cache miss, the service executes two parallel queries against 
    - one for Keyword
    - one for Vector Embedding search

Fusion: 
  - Results are merged using the RRF algorithm in SearchService.ts.

Streaming Response: 
  - Results are sent back to the client and displayed using the Optimistic UI pattern.

## Performance and Observability

(Link to docs/PERFORMANCE_METRICS.md here)

|Metric | Target | Achieved |
|---|---|---|
|Cache Hit Latency | P99<50ms | [Record your actual results] |
|Inference Latency (Full Path) | P99<400ms | [Record your actual results] |
|Cache Hit Rate | >40% | [Record your actual results] |