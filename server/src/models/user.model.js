import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      cast: false,
      required: [true, 'email is required'],
      unique: true, // creates a unique index → duplicate insert throws error code 11000 (→ 409)
      lowercase: true, // "Bob@X.com" and "bob@x.com" are the same account
      trim: true,
      maxlength: [254, 'email is too long'],
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'email is not valid'],
    },
    // Only the bcrypt hash is stored — never the password itself.
    // select: false → not loaded by queries unless asked for with .select('+passwordHash').
    passwordHash: { type: String, required: true, select: false },
  },
  {
    timestamps: true,
    // Shape of the JSON sent to clients (≈ a DTO): never include the hash, rename _id → id.
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

export const User = mongoose.model('User', userSchema);
