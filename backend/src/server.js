import http from 'http';
import { queryLogger, contentTypeMiddleware } from './networking/middleware.js';
import { 
  notFoundHanlder, 
  searchHandler,
  widgetHandler,
} from './networking/handlers.js';

/**
 * Application start
 */
const server = http.createServer((req, res) => {
  queryLogger('INFO', req, res, () => {
    contentTypeMiddleware(req, res, async () => {
      if (req.url.startsWith('/search') && req.method === 'GET') {
        await searchHandler(req, res);
      } else if (req.url.startsWith('/widget') && req.method === 'GET') {
        await widgetHandler(req, res);
      } else {
        notFoundHanlder(req, res);
      }
    })
  });
});

server.listen(8080, () => console.log('HTTP server running on 8080'));