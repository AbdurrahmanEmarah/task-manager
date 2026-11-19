import mongoose from 'mongoose';

// Schema ≈ an EF Core entity class with data annotations.
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      cast: false, // reject non-strings (e.g. 42) instead of silently converting them
      required: [true, 'title is required'],
      trim: true,
      maxlength: [200, 'title must be at most 200 characters'],
    },
    done: {
      type: Boolean,
      cast: false, // only real true/false; Mongoose would otherwise accept "yes", 1, "true"
      default: false,
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'priority must be low, medium or high',
      },
      default: 'medium',
    },
    // Owner of the task. Set by the server from the JWT — never from the request body.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // every query filters by userId, so index it
    },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

// Model ≈ DbSet<Task>. Uses the "tasks" collection.
export const Task = mongoose.model('Task', taskSchema);
