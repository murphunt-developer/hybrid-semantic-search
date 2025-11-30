// File for functions to process a user query

/**
 * Request should look something like this /search?query='Cheap shirts'
 * 
 * Should process it to be this:
 * {
 *  terms: ['cheap', 'shirts'],
 *  query: 'cheap shirts',
 * }
 * 
 * 1. make all terms lowercase
 * 2. create an object with 'terms' and 'query' attributes
 * 3. if no query exists, return undefined
 */