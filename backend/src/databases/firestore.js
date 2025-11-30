// File for acessing firestore database


/**

DBs include: 
  1. the vector database
  2. the source of truth database
  3. server logging database
 
 */



/**
 * Writes log to server logging database
 * @param {*} param0 
 */
export async function writeLog({ level = 'info', message, metadata = {} }) {};


/**
 * Initialize connection to a specified firestore database
 * @param {*} name 
 */
export function initFirestore(name) {};

