// This file will start the server using raw nodejs https 

import 'dotenv/config';
import { readFileSync } from 'node:fs';
import https from 'https';
import { queryLogger, contentTypeMiddleware } from './networking/middleware.js';
import { 
  notFoundHanlder, 
  searchHandler,
  widgetHandler,
} from './networking/handlers.js';

/*
To generate a cert and key for this example:
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout localhost-privkey.pem -out localhost-cert.pem

TODO: remove once deployed to hostinger
*/

const options = {
  key: readFileSync('localhost-privkey.pem'),
  cert: readFileSync('localhost-cert.pem'),
};

const httpsServer = https.createServer(options, (req, res) => {
  queryLogger('info', req, res, () => {
    contentTypeMiddleware(req, res, async () => {
      if (req.url === '/search' && req.method === 'GET') {
        await searchHandler(req, res);
      } else if (req.url === '/widget' && req.method === 'GET') {
        await widgetHandler(req, res);
      } else {
        notFoundHanlder(req, res);
      }
    })
  });
});


httpsServer.listen(1234, () => console.log('HTTPS server running on 1234'));