

export async function searchHandler(req, res) {};
export async function widgetHandler(req, res) {};
export function notFoundHanlder(req, res) {
  res.statusCode = 404;
  res.write(JSON.stringify({ message: 'Route not found' }));
  res.end();
}
