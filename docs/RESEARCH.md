## Research

### Traditional keyword search (BM25): https://en.wikipedia.org/wiki/Okapi_BM25

#### Overview
- Okapi BM25 (BM abbreviation for best matching) is a ranking function used by search engines to estimate the relevance of documents to a given search query.
- It is based on probabilistic retrieval framework developed in 1970s and 1980s by Stephen E. Robertson, Karen Sparck Jones, and others.
- Okapi was the first system to use BM25, which was implemented at London's City University in the 1980s and 1990s

#### Ranking function
- BM25 is a bag-of-words retrieval function that ranks a set of documents based on the query terms appearing in each document, regardless of their proximity within the document.
- It is a family of scoring functions with slightly different components and parameters. One of the most prominent instantiations of the function is as follows:


Given a query `Q`, containing keywords `q1`, `q2`, ... `qn`, the BM25 score of a document `D` is (see bm25-function.png).

`f(qi, D)`: is the number of times that the keyword qi occurs in the document D, 
`|D|`: is the length of the document `D` in words
`avgdl`: is the average document length in the text collection from which documents are drawn
`k1` and `b`: are free parameters, usually chosen, in absence of an advanced optimization, as `k1 ` is a member of `[1.2, 2.0]` and `b = 0.75`
`IDF(qi)`: is the IDF (inverse document frequency) weight of the query term `qi`. (see IDF(qi).png). `N` is the total number of documents in the collection and `n(qi)` is the number of documents containing `qi`

### tf-idf: https://en.wikipedia.org/wiki/Tf%E2%80%93idf
#### Overview:
- In information retrieal, tf-idf (term frequency - inverse document frequency) is a measure of importance of a word to a document in a collection or corpus (in linguistics and natural language processing, a corpus is a dataset, consisting of natively digital and older, digitalized, language resources, either annotated or unannotated), adjusted for the fact that some words appear more frequently in general. Like the bag-of-words modal, it models a document as a multiset of words, without word order. It is a refinement over the simple bag-of-words model, by allowing the weight of words to depend on the rest of the corpus.
- A simple ranking function is computed by summing the tf-idf for each query term

#### Motivation:
- Karen Sparck Jones (1972) conceived a statistical interpretation of term-specificity called Inverse Document Frequency (idf) which became the cornerstone of term weigting.
- The specificity, i.e. it is a measure of how important a word is to a document within a collection, of a term can be quantified as an inverse function of the number of documents in which it occurs 

#### Definition:
1. The tf-idf is the product of two statistics: term frequency and inverse document frequency. There are various ways for determining the exact values of both statistics
2. A formula that aims to define the importance of a keyword or phrase within a document or webpage.

##### Term frequency:
- term frequency, `tf(t,d)` is the relative frequency of a term `t` within a document `d`

```
tf(t,d) =  f_t,d / (∑ t^i element of f_t^i,d)
```

- `f_t,d`: is the raw count of a term in a document i.e. the number of times that term `t` occurs in document `d`
- note the demoniator is simply the total number of terms in document `d` (counting each occurence of the same term separately)
- there are other ways to determine frequency:
  - raw count
  - boolean "frequencies": `tf(t,d) = 1` if `t` occurs in `d`, `0` otherwise
  - logarithmmically scaled frequency: `tf(t,d) = log(1+f_t,d)`
  - augmented frequency, to prevent bias towards longer documents, e.g. raw frequency divided by the raw frequency of the most frequently occuring term in the document


  ##### Inverse document frequency
  - inverse document frequency is a measure of how much information the word provides i.e. how common or rare it is across all documents
  - it is the logarithmically scaled inverse fraction of the documents that contain the word (obtained by dividing the number of total nmber of documents by the number of documents containing the term, and then taking the logarithm of that quotient):

```
idf(t, D) = log(N/n_t)
```

- `D`: st of all documents in the corpus
- `N` = `|D|`: total number of documents in the corpus
- `n_t` = `{d element of D : t element of d}`: number of documents where the term `t` appears (i.e. tf(t,d) != 0). if the term is not in the corpus, this will lead to division by zero. it is therefor more common to adjust the numerator to `1 + N` and the denominator to `1 + |{d element of D : t element of d}|`

##### Term frequency - inverse document frequency
- Then tf-idf is calculated `tfidf(t,d,D) = tf(t,d) * idf(t,D)`
- A high weeight in tf-idf is reached by a high term frequency (in a given document) and a low document frequency of the term in the whole collection of documents; the weights hence tend to filter out common terms.
- since the ratio inside the idf's log function is always greater than or equal to 1, the value of idf (and tf-idf) is greater than or equal to 0. 
- as a term appears i more documents, the ratio inside the logarithm approaches 1, bringing the idf and tf-idf closer to 0


#### Justification on idf
- Sparack Jone's own explaination did not propose much theory, aside from a connection to Zipf's law, an empiricl law stating that when a set of measure values is sorted in descending order, the value of the nth entry is often approximately inversely proportional to n. 
- Attempts have been made to put idf on a probabilistic footing, by estimating the propability that a given document `d` contains a term `t` as the relative document frequency, `P(t|D) = |{d element of D : t element of d}| / N` 
  - so we can define idf as: 
  `idf = -log (P(t|D))`
  `    = log (1/P(t|D))`
  `    = log (N/|{d element of D : t element of d}|)`

- the probabilistic interpretation takes the saem form as that of self information, but applying information-theoretic notions to problems in information retrieval leads to problems when defining the appropriate event sapces for the required probability distributions: not only documents needs to be taken into account, but also queries and terms.

##### Information Theory 
- In information theory, the information content, self-information, surprisal, or Shannon information is a basic quantity derived from the proabability of a particular event occuring from a random variable. It can be thought of as an alternative way of expressing probability, much like odds or log-odds, but which has particular mathematical advantages in the setting of information theory.
- Shannon information can be interpreted as quantifying the level of "surprise" of a particular outcome, as it is such a basic quantity, it also appears in several other settings, such as the length of a message needed to transmit the event given an optimal source coding of the random variable.
- Shannon information is closely related to entropy (the avg level of uncertainty or information associated with the variable's potential states or possible outcomes), quantifying how suprising the random variable is "on average". 
- Information content can be expressed in various units of information, of which the most common is the "bit" 

##### Probability space
- In probability theory, a proabability space or a probability triple, is a mathematical construct that provides a formal model of a random process or "experiment". For example, one can define a probability space which models the throwing of a dice:
- A probability space consists of three elements:
  1. sample space: set of all possible outcomes of a random process under consideration
  2. event space: set of events, where an event is a subset of outcomes in the sample space
  3. probability function: which assigns, to each event in the event space, a probability, a number beteen 0 and 1

Example of dice:
  1. Set {1,2,3,4,5,6}
  2. Set of all subsets i.e. simple events {5} "dice lands on 5" complex events {2,4,6} "dice lands on even number"
  3. function() = event space length divided by sample space length

#### Link with information theory
- Both term frequency and inverse document frequency can be formulated in terms of information theory; it helps to understand why their product has a meaning in terms of join information content of a document. A characteristic assumption about the distribution p(d,t) is that:

`p(d|t) = 1 / {d element of D : t element of d}`

- This assumption and its implications, according to Aizawa: "represent the heuristic that tf-idf employs"
- The conditional entropy of a "randomly chosen" document in the corpus `D`, conditional to the fact it contains a specific term `t` (and assuming that all documents have equal probability to be chosen) is:

```
H(D|T = t) = - ∑(d) p_d|t log p_d|t = - log (1 / {d element of D : t element of d}) = log (|{d element of D : t element of d}| / |D|) + log(|D|) = -idf(t) + log(|D|)
```

- In terms of notation, `D` and `T` are "random variables" corresponding to respectively draw a document or a term. 
- The mutual information can be expressed as:

```
M(T;D) = ∑(t,d) p_t|d & p_d * idf(t) = ∑(t,d) tf(t,d) * (1 / |D|) * idf(t) = (1/|D|) * ∑(t,d) tf(t,d) * idf(t)
```

- This expression shows that summing the tf-idf of all possible terms and documents recovers the mutual information between documents and term taking into account all the specificities of their joint distribution. Each tf-idf hence carries the "bit of information" attached to a term x document pair. 

##### Mutual information: https://en.wikipedia.org/wiki/Mutual_information
- In probability theory and information theory, the mutual information (MI) of two random variables is a measure of the mutual dependence between the two variables. more specifically, it quantifies the "amount of information" obtained about one random variable by observing the other random variable.


#### Link with statistical theory
- tf-idf is closely related to the negative logarithmically transofrmed p-value from a one-tailed formulation of Fisher's exact test when underlying corpus documents satisfy certain idealized assumptions

##### Fisher's exact test: https://en.wikipedia.org/wiki/Fisher%27s_exact_test
- Fisher's exact test (Fisher-Irwin test) is a statistical significnce test used in the analysis of contingency tables. In practice it is employed when sample sizes are small, it is valid for all sample sizes. The test assumes all row and column sums of the contingency table were fixed by design and tends to be conservative and underpowered outside of this testing.


|  | Class 1 | Class 2 | Row Total
|---|---|---|---|
| Blue | a | b | a + b |
| Red | c | d | c + d |
| Column Total | a + c | b + d | a + b + c + d (=n) |

```
     (a + b)(c + d)   (a + b)(c + d)
p =     a      d         b      d         (a + b)! (c + d)! (a + c)! (b + d)!
     ______________ = _______________ = _______________________________________
            n                n                      a! b! c! d!
         (a + c)          (b + d)
```


#### Example of tf-idf

- We have term count tables of a corpus consisting of two documents

**Document 1**
| Term | Term Count |
|---|---|
| this | 1 |
| is | 1 |
| a | 2 |
| sample | 1 |

**Document 2**
| Term | Term Count |
|---|---|
| this | 1 |
| is | 1 |
| another | 2 |
| sample | 3 |

- The calculation of the tf-idf for the term "this" is performed as follows:
- In its raw frequency form, tf is just the frequency of the "this" for each document. In each document, the word "this appears once; but as the document 2 has more words, its relative frequency is smaller

`tf("this", d_1) = 1/5 = 0.2`
`tf("this", d_2) = 1/7 ~= 0.14`

- An idf is constant per corpus, and accounts for the ratio of documents that include the word "this". In this case, we have a corpus of two documents and all of them include the word "this".

`idf("this", D) = log(2/2) = 0`

- So tf-idf is zero for the word "this", which implies that the word is not very informative as it appears in all documents. 

```
tfidf("this", d_1, D) = 0.2 * 0 = 0
tfidf("this", d_2, D) = 0.14 * 0 = 0
```

- The word "example" is more intersting, it occurs 3 times, but only in the second document

```
tf("example", d_1) = 0/5 = 0
tf("example", d_2) = 3/7 ~= 0.429
idf("example", D) = log(2/1) = 0.301

tfidf("example", d_1, D) = tf("example", d_1) * idf("example", D) = 0 * 0.301 = 0
tfidf("example", d_2, D) = tf("example", d_2) * idf("example", D) = 0.429 * 0.301 ~= 0.129
```

### Vector Search: https://en.wikipedia.org/wiki/Vector_database
- Vector database, vector store, or vector search engine is a database that uses the vector space model to store vectors (fixed-length lists of numbers) along with other data items. Vector databases typically implement one or more approximate nearest neighbor algorithms, so that one can search the database with a query vector to retrieve the closest matching database record.
- Vectors are mathematical representations of data in high-dimensional space. In this space, each dimension corresponds to a feature of the data, with the number of dimensions ranging from a few hundres to tens of thousand, depending on the complexity of the data being represented.
- A vector's position in this space represents its characteristics. Words, phrases, or entire documents, as well as images, audio, and other types of data, can all be vectorized
- These feature vectors may be computed from the raw data using machine learning methods such as feature extraction algorithms, word embeddings, or deep learning networks. The goal is that semantically similar data items receive feature vectors close to each other.

#### Applications and hybrid reasoning
- Vector databases are often used to implement retrieval-augmented generation (RAG), a method to improve domain-specific responses of large language models. 
- The retrieval component of a RAG can be any search system, but is most often implemented as a vector database.
  - Text documents describing the domain of interest are collected, and for each document or document section, a feature vector (known as an "embedding") is computed, typically using a deep learning network, and stored in a vector database. 
  - Given a user prompt, the feature vector of the prompt is computed, and the database is queried to retrieve the most relevant documents. 
  - These are then automatically added into the context window of the large language model, and the large language model proceeds to create a response to the prompt given this vector.
- Beyond RAG, vector databases are increasingly used in hybrid reasoning systems that combine dense semantic search with symbolic or graph-based representations. This approach, sometimes called neuro-symbolic retrieval, enables queries that draw on both semantic similarity and structured relationships.
  - For example, the open-source framework Cognee integrates vector search for semantic retrieval with a knowledge graph, supporting hybrid reasoning across symbolic and dense representations.


#### Techniques
- The most important techniques for similarity search on high-dimensional vectors include:
  - Hierarchical Navigable Small World (HNSW) graphs
  - Locality-sensitive Hashing (LSH) and Sketching
  - Product Quantization (PQ)
  - Inverted Files
- In recent benchmarks, HNSW-based implementations have been among the best performers. 

#### Nearest Neighbor Search: https://en.wikipedia.org/wiki/Nearest_neighbor_search
- Nearest neighbor search (NNS), as a form of proximity search, is the optimization problem of finding the point in a given set that is closest (or most similar) to a given point. Closeness is typically expressed in terms of a dissimilarity function: the less similar the objects, the larger the function values.
- Formally, nearest neighbor (NN) search problem is defined as follows:
  - Given a set `S` of points in a space `M` and a query point `q is an element of M`, find the closest point in `S` to `q`. 
- Donal Knuth in "The Art of Computer Programming" (1973) called it the post-office problem, referring to an applicatino of assigning to a residence the nearest post office.
- A direct generalization of this problem is a k-NN search, where we need to find the k closest points.
- Most commonly `M` is a metric space and dissimilarity is expressed as a distance metric, which is symmetric and satisfies the triangle inequality
- Even more common, `M` is taken to be the d-dimensional vector space where dissimilarity is measured using the Euclidean distance, Manhattan distance or other distance metric.

##### Metric space: https://en.wikipedia.org/wiki/Metric_space
- A set together with a notion of distance between its elements, usually called points. 
- The distance is measured by a function called a metric or distance function.
- The most common is 3D Euclidean space with its usual notion of distance.

##### Triangle inequality: https://en.wikipedia.org/wiki/Triangle_inequality
- The triangle inequality states that for any triangle, the sum of the lengths of any two sides must be greater than or equal to the lenght of the remaining side.
- This statement permits the inclusion of degenerate triagles but some authors will exclude this possibility, thus leaving out the possibility of equality. 
- If `a`, `b`, and `c` are the lengths of the sides of a triangle then the triangle inequality states that `c <= a + b`

### Reciprocal Rank Fusion (RRF):
- A rank aggregation algorithm used in information retrieval and search systems, particularly in hybrid search (combining multiple search methods like lexical/keyword and vector/semantic search) or Retrieval-Augmented Generation (RAG) systems.

#### How it works:
- RRF operates directly on the "rank" position of documents rather than their raw relevance scores, which makes it robust to the different and incomparable scoring scales of various search methods.
  1. Obtain multiple ranked lists: the system executes a query using multiple retrieval methods (e.g. a keyword search using BM25 and a vector search using embeddings), each producing its own list of documents ranked by relevance
  2. Calculate reciprocal rank score: for every document that appears in any of the ranked lists, RRF calculates a reciprocal rank score for each appearance. The score is calculated using:

  ```
  RRF Score_list = 1 / (rank + k)

  ```
  - `rank`: is the document's position in that specific list (starting from 1)
  - `k` is a smoothing constant (typically set to 60) that prevents top-ranked items from completely dominating the score and helps break ties

  3. Combine and Sum Scores: a document's final RRF score is the sum of its reciprocal rank scores across all the individual ranked lists where it appears

  ```
  Final RRF Score(d) = ∑(r is an element of R) 1 / (rank_r (d) + k)
  ```
  - `d` is the document
  - `R` is the set of all ranked lists
  - `rank_r(d)` is the rank of a document `d` in list `r`
  - if a document is missing from a list, its contribution from that list is 0
  4. Final reranking: all documents are then sorted by their final RRF score in descending order to produce the single, fused, and final list of results


### Semantic Caching: https://www.youtube.com/watch?v=0agBo7_wKTo
- The core idea behind semantic caching is to bypass the expensive steps of a RAG pipeline (vector retrieval and LLM inference) if a semantically similar question has already been answered.
  1. Query embedding: when a user submits a new query (Q), it is first converted into a vector embedding (a numerical representation of its meaning) using an embedding model.
  2. Semantic lookup: the system then performs a vector simliarity search in the semantic cache. This cache is typically a vector database that stores the embeddings of past user queries along with their corresponding final responses or retrieved data.
  3. Cache hit vs miss:
    - Cache hit: (fast path): if the new query's embedding is found to be highly similar (above a predefined similarity threshold) to a previously cached query's embedding, the system recognizes them as having the same intent. It immediately returns the pre-computed, cached response to the user. This is extremely fast and avoids calling the LLM
    - Cache miss (full pipeline): if no semanticaly similar query is found, the new query proceeds through the full RAG pipeline (retrieval from the main vector store, LLM generation). The new query and its final response are then added to the semantic cache for future reuse.

- Process of creating a vector embedding: 
  1. Preprocessing
    - normalization: convert text to lowercase
  2. Selection of embedding model
    - most critical
    - Model Choice: use a state of the art embedding model, such as those provided by openAI, Cohere, or efficient open source models like `all-MiniLM-L6-v2` or BGE/Ember 
    - Consistency: The same embedding model must be used to create the vector key when the entry is stored in the cache and when the entry is retrieved from the cache
  3. Generating the vector
    - The preprocessed text is passed to the chosen embedding model's API 
    - Input => Output: model takes input string and outputs a fixed-length list of floating point numbers
    - Example: "What is the capital of France?" might be converted into V_q = [0.012, -0.98, 0.54,..., 0.77]. This is the vector cache key
  4. Semantic Cache lookup
    - Once the vector V_key is generated, it is used to query the vector database (cache store)
    - Search Operation: instead of an exact string match, the system performs an Approximate Nearest Neighbor (ANN) search on the vector index
    - Similarity Metric: The search measures the distance (similarity) between the new query vector V_key and all stored cache key vectors (V_c1, V_c2,...) Cosine similarity is the most common metric
    - Cache hit decision: if the similarity score between V_key and any stored cache vector V_ci exceeds a predetermined similarity threshold (e.g. 0.90 to 0.95) its considered a cache hit and the stored response associated with V_ci is returned to avoid the expensive LLM call

### PostgreSQL: https://www.postgresql.org/about/
- PostgreSQL is a powerful, open source object-relational database system that uses and extends the SQL language combined with many features that safely store and scale the most complicated data workloads.

#### Why use PostgreSQL
- Free and open source
- You can define own data types
- You can build out custom functions + write code from different programming languages without recompiling your database
- As of version 18 release in September 2025, PostgreSQL conforms to at least 170 of the 177 mandatory features for SQL:2023 Core conformance
  - As of writing this, no relational database meets full conformance with this standard

### Cloud Firestore: 

#### Why Firestore does not support full text search
- Cloud firestore and other NoSQL databases prioritize scalability, real time synchronization, and simple query patterns
- Full-Text Search is complex, and rely on fundamentally different data structures and logic
  - Inverted Index: a full text engine must maintain a specialized structure called an inverted index, which maps every unique word (term) in your entire dataset to a list of documents containing that word
  - Lexical Analysis: search engines perform complex text transformations:
    - tokenization: breaking sentences into words
    - stemming/lemmatization: reducing words to their root form (e.g. "running", "runs", "ran" --> "run")
    - stop word removal: ignoring common words ("a", "the", "is")
  - Relevance Scoring: they use ranking algorithms (like BM25) that calculate a score based on factors like term frequency (how often a word appears in the document) and inverse document frequency (how rare the word is across the whole collection)

#### How Algolia Works with Firestore
- It is a separate, parallel indexing system that operates independently to provide search functionality
- Core Architecture: 
  1. Source of truth
    - Cloud firestone: original document is created, updated, deleted here
  2. Synchronization
    - Cloud functions/extension: listener function detects change in firestore
  3. Indexing
    - Cloud functions/extension: function extracts the relevant text data and sends it over the internet to algolia API
  4. Search Index
    - Algolia: receives the data, processes it through its lexical analysis, calculates all terms frequencies and inverted index data, and store the optimized search records
  5. Query
    - Client: user performs a search in your app, the query is sent directly to Algolia API
  6. Results
    - Algolia: algolia executes the search using optimized inverted index, calculates the BM25-like relevance scores, and returns a fast, ranked list of matching document IDs
  7. Final Retrieval
    - Client: app uses the document IDs returned by Algolia to fetch the complete, current documents from firestore
- Setting up algolia extension on firebase: https://www.youtube.com/watch?v=9BCQHfacqNU
- Test Dataset:
  - Application ID: YCM2V3GS6F
  - Search API Key: c33bdc3a81c83c6ee0bcad0b0a5a8485
  - Write API Key: 249d8b5959c941906ce0f4f1410f16c6

```
exapmle search experience: 

npx create-instantsearch-app@latest instantsearch-app \
    --name 'instantsearch-app' \
    --template 'InstantSearch.js' \
    --app-id 'YCM2V3GS6F' \
    --api-key 'c33bdc3a81c83c6ee0bcad0b0a5a8485' \
    --index-name 'algolia_apparel_sample_dataset' \
    --attributes-to-display 'product_type,description,color.0' \
    --no-interactive \
    --image-attribute 'images.0'
```

#### Hybrid Search:
1. Vector Search (Semantic Search)
  - Native Vector Fields: firestore now suppors storing vector embeddings directly in a document field
  - KNN Indexing: you can create and manage K-Nearest Neighbor vector indxes on your Firestore collection, allowing for high-performance similarity queries
  - Workflow:
    1. Generate Embeddings: when a document is created / updated, a cloud function should trigger
    2. Use a LLM/API: the function sends the document's text content to an embedding model (like those in vertext AI) to generate a high-dimensional vector
    3. Store the vector: function writes this vector back to the corresponding firestore document
    4. Query: your server-side code (nodejs) can then use `findNearest` function to exectue a vector search against the indexed field
2. BM25 Search (Keyword/Full Text Relevance):
  - The external index requirement: for high-performane, ranked full-text search like BM25, you must use a dedicated third-party search engine
  - Recommended services:
    - Meilisearch: open source, fast, easy-to-use search engine
    - Algolia: popular, managed search-as-a-service solution that integrates well with firebase
    - Elasticsearch/OpenSearch: powerful but complex, often used for massive datasets
  - Workflow:
    1. Data synchronization: use firebase extension/cloud functions that listen to changes in your firestone collection
    2. Index creation: whenever a document is created, updated, or deleted, the function sends the data to the external search service to keep its BM25 index up-to-date
    3. Search Query: your application sends the full-text search query directly to the external search service PI. The service returns a list of highly relevant document IDs, ranked by the BM25 score
    4. Data Retrieval: the application uses those document IDs to fetch the full documents from firestore
