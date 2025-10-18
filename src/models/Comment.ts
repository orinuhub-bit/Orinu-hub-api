import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  user: mongoose.Types.ObjectId;
  comic: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
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
    },
    content: {
      type: String,
      required: [true, 'Le contenu du commentaire est requis'],
      trim: true,
      minlength: [1, 'Le commentaire ne peut pas être vide'],
      maxlength: [1000, 'Le commentaire ne peut pas dépasser 1000 caractères']
    }
  },
  {
    timestamps: true
  }
);

// Index pour améliorer les performances
CommentSchema.index({ comic: 1, createdAt: -1 });
CommentSchema.index({ user: 1 });

export default mongoose.model<IComment>('Comment', CommentSchema);
