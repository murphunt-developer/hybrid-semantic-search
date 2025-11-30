import util from 'node:util';
import path from 'path';
import { writeLog } from '../databases/firestore.js';

/**
 * Logger middleware that sends query logs to 
 * @param {*} level 
 * @param {*} req 
 * @param {*} _ 
 * @param {*} next 
 */
export const queryLogger = async (level, req, _, next) => {
  const timestamp = new Date().toUTCString();
  const format = (obj) => util.inspect(obj, { depth: null, colors: false, compact: false });
  await writeLog({
    level,
    timestamp,
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

/**
 * Content Type header setter based on path.extname of the req.url, 
 * defaults to text/html
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const contentTypeMiddleware = (req, res, next) => {
  const ext = path.extname(req.url).toLowerCase();
  let contentType = 'text/html';
  switch (ext) {
    case '.css':
      contentType = 'text/css';
      break;
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.html':
      contentType = 'text/html';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
    case '.jpeg':
      contentType = 'image/jpeg';
      break;
    case '.gif':
      contentType = 'image/gif';
      break;
    case '.mov':
      contentType = 'video/quicktime';
      break;
    case '.mp4':
      contentType = 'video/mp4';
      break;
  }
  res.setHeader('Content-Type', contentType);
  next();
}