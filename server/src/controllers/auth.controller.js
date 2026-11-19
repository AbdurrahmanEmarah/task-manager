import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';
import { signToken } from '../utils/jwt.js';

// bcrypt ≈ ASP.NET Identity's PasswordHasher: salted, deliberately slow hash.
// 12 rounds = 2^12 iterations; each extra round doubles the cost for attackers (and us).
const SALT_ROUNDS = 12;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 72; // bcrypt ignores bytes after 72

const readCredentials = (body = {}) => {
  const { email, password } = body;
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    return { error: 'email and password are required' };
  }
  return { email: email.trim().toLowerCase(), password };
};

// POST /api/auth/register  → 201 { token, user }
export const register = async (req, res) => {
  const { email, password, error } = readCredentials(req.body ?? {});
  if (error) return res.status(400).json({ error });

  if (password.length < MIN_PASSWORD_LENGTH || Buffer.byteLength(password) > MAX_PASSWORD_LENGTH) {
    return res
      .status(400)
      .json({ error: `password must be ${MIN_PASSWORD_LENGTH}–${MAX_PASSWORD_LENGTH} characters` });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  // A duplicate email throws a Mongo 11000 error → error middleware turns it into 409.
  const user = await User.create({ email, passwordHash });

  res.status(201).json({ token: signToken(user._id), user });
};

// POST /api/auth/login  → 200 { token, user }
export const login = async (req, res) => {
  const { email, password, error } = readCredentials(req.body ?? {});
  if (error) return res.status(400).json({ error });

  const user = await User.findOne({ email }).select('+passwordHash');
  const ok = user && (await bcrypt.compare(password, user.passwordHash));

  // Same message whether the email or the password was wrong,
  // so attackers can't use login to discover which emails are registered.
  if (!ok) return res.status(401).json({ error: 'Invalid email or password' });

  res.json({ token: signToken(user._id), user });
};

// GET /api/auth/me  (requires auth) → 200 user
export const me = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(401).json({ error: 'User no longer exists, please log in again' });
  res.json(user);
};
