// Runs when no route matched: JSON 404 instead of Express's HTML "Cannot GET ...".
export const notFound = (req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
};

// Central error handler ≈ app.UseExceptionHandler(...) in ASP.NET Core.
// Express recognises it as an error handler because it takes FOUR parameters.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  // Malformed JSON body (thrown by express.json())
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body is not valid JSON' });
  }

  // Schema rules failed (required, enum, maxlength, wrong type on create)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e =>
      e.name === 'CastError' ? `${e.path} has an invalid value` : e.message
    );
    return res.status(400).json({ error: messages.join('; ') });
  }

  // Unique index violated (e.g. registering an email that already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? 'value';
    return res.status(409).json({ error: `That ${field} is already registered` });
  }

  // A value couldn't be converted to the schema type, e.g. /api/tasks/abc (not an ObjectId)
  if (err.name === 'CastError') {
    const message = err.path === '_id' ? 'Invalid task id' : `${err.path} has an invalid value`;
    return res.status(400).json({ error: message });
  }

  // Other client errors raised by Express/body-parser (e.g. 413 body too large)
  const status = err.status ?? err.statusCode ?? 500;
  if (status < 500) {
    return res.status(status).json({ error: err.expose ? err.message : 'Bad request' });
  }

  // Anything else is our bug: log the details, but don't leak them to the client.
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};
