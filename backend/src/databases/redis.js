// File for accessing redis query to vector database
import 'dotenv/config';

// /**
// DBs include: 
//   1. the query to vector DB
//   2. semantic cache DB
 
//  */
// import { createClient } from 'redis';

// async function initRedisDatabase() {
//   const client = createClient({
//     username: 'default',
//     password: process.env.REDIS_PASSWORD, // TODO:  Use process.env.REDIS_PASSWORD
//     socket: {
//         host: 'redis-12315.c331.us-west1-1.gce.cloud.redislabs.com',
//         port: 12315
//     }
//   });

//   client.on('error', err => console.error('Redis Client Error', err));

//   try {
//     await client.connect();
//     console.log('Connected to Redis.');

//     const bikes = await fetchData();
    
//     // Safety check: ensure we actually got data back
//     if (!bikes || !Array.isArray(bikes)) {
//         throw new Error('Failed to load bike data');
//     }

//     const pipeline = client.multi();

//     bikes.forEach((bike, index) => {
//         const i = index + 1; 
//         const redisKey = `bikes:${String(i).padStart(3, '0')}`;
//         pipeline.json.set(redisKey, '$', bike);
//     });

//     console.log(`Seeding ${bikes.length} bikes...`);
//     const pipelineResults = await pipeline.exec(); 
//     // Note: pipelineResults contains an array of responses for every command
//     const singleResult = await client.json.get('bikes:010', {
//       path: '$.model'
//     });
    
//     console.log('Verification check (bikes:010 model):', singleResult);

//     const singleResult2 = await client.json.get('bikes:009', {
//       path: '$.model'
//     });
    
//     console.log('Verification check (bikes:009 model):', singleResult2);


//   } catch (error) {
//     console.error('Script failed:', error);
//   } finally {
//     // Crucial: Close connection so the script exits
//     client.destroy();
//     console.log('Connection closed.');
//   }
// }

// const fetchData = async () => {
//   const url = 'https://raw.githubusercontent.com/bsbodden/redis_vss_getting_started/main/data/bikes.json';
//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Fetch error:', error);
//     return null; // Return null explicitly so we can handle it above
//   }
// }

// initRedisDatabase();


import { createClient } from 'redis';
import { pipeline } from '@xenova/transformers';

async function vectorSearchDemo() {
  // 1. Setup Redis Client
  const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-12315.c331.us-west1-1.gce.cloud.redislabs.com',
        port: 12315
    }
  });
  client.on('error', err => console.error('Redis Error:', err));
  await client.connect();

  try {
    // 2. Initialize Local Embedding Model (Runs locally on CPU)
    console.log('Loading AI model...');
    const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    
    // 3. Define the Index Schema
    // We create an index named 'idx:bikes' for JSON documents starting with 'bikes:'
    try {
      await client.ft.create('idx:bikes', {
        '$.brand': { type: 'TEXT', AS: 'brand' },
        '$.model': { type: 'TEXT', AS: 'model' },
        '$.description': { type: 'TEXT', AS: 'description' },
        // The Vector Field Definition
        '$.embedding': { 
          type: 'VECTOR',
          ALGORITHM: 'HNSW', // Hierarchical Navigable Small World (fast)
          TYPE: 'FLOAT32',
          DIM: 384,                // Must match the output of your model (MiniLM is 384)
          DISTANCE_METRIC: 'COSINE',
          AS: 'vector'             // Alias used in queries
        }
      }, {
        ON: 'JSON',
        PREFIX: 'bikes:'
      });
      console.log('Index created.');
    } catch (e) {
      if (e.message === 'Index already exists') {
        console.log('Index already exists, skipping creation.');
      } else {
        throw e;
      }
    }

    // 4. Fetch & Seed Data
    const url = 'https://raw.githubusercontent.com/bsbodden/redis_vss_getting_started/main/data/bikes.json';
    const response = await fetch(url);
    const bikes = await response.json();

    console.log(`Processing ${bikes.length} bikes (generating vectors)...`);
    
    for (let i = 0; i < bikes.length; i++) {
      const bike = bikes[i];
      const redisKey = `bikes:${String(i + 1).padStart(3, '0')}`;
      
      // Generate Vector: Convert text description -> Array of numbers
      const output = await embedder(bike.description, { pooling: 'mean', normalize: true });
      const embeddingArray = Array.from(output.data); // Convert Float32Array to standard array

      // Add embedding to the bike object before saving
      bike.embedding = embeddingArray;

      await client.json.set(redisKey, '$', bike);
    }
    console.log('Data seeded with vectors.');

    // 5. Run a Semantic Query
    const userQuery = "Best bike for rough terrain and hills";
    console.log(`\nSearching for: "${userQuery}"`);

    // Embed the query string
    const queryOutput = await embedder(userQuery, { pooling: 'mean', normalize: true });
    // Redis requires raw binary buffer for the vector
    const queryVector = Buffer.from(queryOutput.data.buffer);

    // Execute KNN Search
    // Syntax: "*=>[KNN 3 @vector $BLOB AS score]"
    const results = await client.ft.search('idx:bikes', 
      '*=>[KNN 3 @vector $BLOB AS score]', 
      {
        PARAMS: {
          BLOB: queryVector
        },
        SORTBY: 'score',
        DIALECT: 2, // Required for vector search
        RETURN: ['model', 'score', 'description']
      }
    );

    // 6. Display Results
    results.documents.forEach(doc => {
      console.log(`\n[Score: ${(1 - doc.value.score).toFixed(4)}] ${doc.value.model}`);
      console.log(`> ${doc.value.description.substring(0, 100)}...`);
    });

  } catch (error) {
    console.error(error);
  } finally {
    await client.disconnect();
  }
}

vectorSearchDemo();