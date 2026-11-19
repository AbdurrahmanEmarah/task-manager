import { verifyToken } from '../utils/jwt.js';

// requireAuth ≈ [Authorize] in ASP.NET Core.
// Expects header:  Authorization: Bearer <token>
// On success sets req.user = { id }, which controllers use to scope queries.
export const requireAuth = (req, res, next) => {
  const header = req.get('Authorization') ?? '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub };
    next();
  } catch {
    // Bad signature, malformed, or expired — the client should log in again.
    return res.status(401).json({ error: 'Session expired or invalid, please log in again' });
  }
};
