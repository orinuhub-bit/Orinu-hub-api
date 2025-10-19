import mongoose, { Document, Schema } from 'mongoose';

export interface IChapter extends Document {
  comic: mongoose.Types.ObjectId;
  chapterNumber: number;
  title: string;
  pages: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ChapterSchema = new Schema<IChapter>(
  {
    comic: {
      type: Schema.Types.ObjectId,
      ref: 'Comic',
      required: true
    },
    chapterNumber: {
      type: Number,
      required: [true, 'Le numéro de chapitre est requis'],
      min: [1, 'Le numéro de chapitre doit être au moins 1']
    },
    title: {
      type: String,
      required: [true, 'Le titre du chapitre est requis'],
      trim: true,
      maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
    },
    pages: {
      type: [String],
      required: [true, 'Au moins une page est requise'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'Le chapitre doit contenir au moins une page'
      }
    }
  },
  {
    timestamps: true
  }
);

// Index pour améliorer les performances
ChapterSchema.index({ comic: 1, chapterNumber: 1 }, { unique: true });

export default mongoose.model<IChapter>('Chapter', ChapterSchema);
