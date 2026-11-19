import jwt from 'jsonwebtoken';

// JWT_SECRET signs tokens; anyone who knows it can mint tokens for any user,
// so it lives only in .env / the hosting dashboard, never in git.
const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set. Add it to server/.env (see .env.example)');
  return secret;
};

const EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';

// "sub" (subject) is the standard JWT claim for "who this token is about" ≈ ClaimTypes.NameIdentifier.
export const signToken = (userId) =>
  jwt.sign({ sub: userId.toString() }, getSecret(), { expiresIn: EXPIRES_IN, algorithm: 'HS256' });

// Throws if the signature is wrong or the token has expired.
export const verifyToken = (token) => jwt.verify(token, getSecret(), { algorithms: ['HS256'] });

// Called at startup so a missing secret fails fast instead of on the first login.
export const assertJwtConfigured = () => getSecret();
