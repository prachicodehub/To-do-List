import mongoose from 'mongoose';

export const PRIORITIES = ['low', 'medium', 'high'];
export const STATUSES = ['in-progress', 'completed'];

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 2000, default: '' },
    // Scheduled start of the task (date + time). Drives weekly grouping.
    dueAt: { type: Date, required: true },
    // Optional end time on the same schedule.
    endAt: { type: Date, default: null },
    priority: { type: String, enum: [...PRIORITIES, null], default: null },
    status: { type: String, enum: STATUSES, default: 'in-progress' },
    completedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        delete ret._id;
        return ret;
      },
    },
  },
);

// Range queries by week / day and status counts.
taskSchema.index({ dueAt: 1, status: 1 });

taskSchema.pre('save', function syncCompletedAt(next) {
  if (this.isModified('status')) {
    this.completedAt = this.status === 'completed' ? new Date() : null;
  }
  next();
});

export default mongoose.models.Task || mongoose.model('Task', taskSchema);
