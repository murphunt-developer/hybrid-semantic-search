import util from 'node:util';
import { writeLog } from '../databases/firestore.js';

/**
 * Logger middleware that sends query logs to 
 * @param {*} level 
 * @param {*} req 
 * @param {*} _ 
 * @param {*} next 
 */
export const logger = async (level, req, _, next) => {
  const format = (obj) => util.inspect(obj, { depth: null, colors: false, compact: false });
  await writeLog({
    level,
    message: `
    ---------------------------------------------------------
    Method: ${req.method}
    Url: ${req.url}
    Query: ${format(req.query)}
    Ip: ${req.ip}
    Session: ${format(req.session)}
    Headers: ${format(req.headers)}
    Cookies: ${format(req.cookies)}
    ---------------------------------------------------------
  `,
    metadata: {}
  });
  next();
};