

/**
 * 1. Process the query parameters of /search
 * 2. Forward the parameters to the /search API 
 * @param {*} req 
 * @param {*} res 
 */
export async function searchHandler(req, res) {
  res.statusCode = 200;
  res.write(JSON.stringify({ message: 'searchHandler invoked' }));
  res.end();
};

export async function widgetHandler(req, res) {
  res.statusCode = 200;
  res.write(JSON.stringify({ message: 'widgetHandler invoked' }));
  res.end();
};
export function notFoundHanlder(req, res) {
  res.statusCode = 404;
  res.write(JSON.stringify({ message: 'Route not found' }));
  res.end();
}
