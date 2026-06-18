import mongoose from 'mongoose';

interface ActivityDocument {
  user_id: number;
  role: string;
  activity: string;
  metadata: Record<string, unknown>;
  created_at: Date;
}

const activitySchema = new mongoose.Schema<ActivityDocument>({
  user_id: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  activity: {
    type: String,
    required: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: false,
  },
});

export const Activity = mongoose.model<ActivityDocument>('Activity', activitySchema);
