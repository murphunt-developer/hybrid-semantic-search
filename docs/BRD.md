## Customer Pain Point(s)
This is a list of potential client pain points:
1. We have no search implementation to show customers relavant products.
2. We have search and it is fast, but it doesn't recommend relevant products.
3. We have search and it recommends relevant products, but it is slow.

## Goal: 
Dramatically improve customer search quality and response time across all platform interfaces (Web, Mobile, Internal Tools)

## Solution

| Category | Problem | Solution |
|---|---|---|
| Customer Experience | Poor Relevance: Our current keyword-only search (BM25) fails when users use conceptual or natural language queries (e.g., searching for "running shoes" instead of "Nike Pegasus 40"). | High Accuracy: Implement a Hybrid Search combining keyword and vector methods to understand the intent of the query, resulting in highly relevant top results. |
| System Performance | High Latency & Volatility: AI/Vector searches are computationally expensive, leading to high P99 latency (currently $\approx 350\text{ms}$), driving user frustration and drop-offs. | Low Latency: Utilize Semantic Caching to instantly serve answers for similar past queries and employ a streaming UI to deliver the perception of speed, targeting $\text{P99} < 100\text{ms}$. |
| Operation Cost | We run expensive vector / LM inferences for common or slightly rephrased queries | Cost Efficiency: The semantic caching layer is projected to handle 30% of all search traffic, saving significant operational costs on every cache hit. |

