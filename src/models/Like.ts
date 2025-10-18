import mongoose, { Document, Schema } from 'mongoose';

export interface ILike extends Document {
  user: mongoose.Types.ObjectId;
  comic: mongoose.Types.ObjectId;
  createdAt: Date;
}

const LikeSchema = new Schema<ILike>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comic: {
      type: Schema.Types.ObjectId,
      ref: 'Comic',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Index unique pour éviter les doublons
LikeSchema.index({ user: 1, comic: 1 }, { unique: true });

export default mongoose.model<ILike>('Like', LikeSchema);
