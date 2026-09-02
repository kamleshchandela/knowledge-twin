// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ detail: err.message || 'Internal server error' });
}
