// This file will start the server using raw nodejs https 

import 'dotenv/config';
import { readFileSync } from 'node:fs';
import https from 'https';
import { logger, contentTypeMiddleware } from './middleware.js';
import { 
  trackerJsFileHandler, 
  notFoundHanlder, 
  collectHandler, 
  dashboardHandler, 
  cssFileHandler 
} from './handlers.js';

/*
To generate a cert and key for this example:
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout localhost-privkey.pem -out localhost-cert.pem

TODO: remove once deployed to hostinger
*/

const options = {
  key: readFileSync('server/localhost-privkey.pem'),
  cert: readFileSync('server/localhost-cert.pem'),
};

// ---- HTTPS server for analytics ingest ----
const httpsServer = https.createServer(options, (req, res) => {
  logger('info', req, res, () => {
    contentTypeMiddleware(req, res, async () => {
      if (req.url === '/search' && req.method === 'GET') {
      } else if (req.url === '/collect' && req.method === 'POST') {
        await collectHandler(req, res);
      }  else if (req.url === '/dashboard' && req.method === 'GET') {
        await dashboardHandler(req, res);
      } else if (req.url === '/style.css' && req.method === 'GET') {
        await cssFileHandler(req, res);
        // TODO: add another handler for /analyitcs explaining how clients 
        // can add the script tag to their page and get analytics
      } else {
        notFoundHanlder(req, res);
      }
    })
  });
});


httpsServer.listen(8444, () => console.log('HTTPS server running on 8444'));