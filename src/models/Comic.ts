import mongoose, { Document, Schema } from 'mongoose';

export interface IComic extends Document {
  title: string;
  description: string;
  coverImage: string;
  genre: string[];
  language: string;
  tags: string[];
  author: mongoose.Types.ObjectId;
  views: number;
  likesCount: number;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

const ComicSchema = new Schema<IComic>(
  {
    title: {
      type: String,
      required: [true, 'Le titre est requis'],
      trim: true,
      minlength: [2, 'Le titre doit contenir au moins 2 caractères'],
      maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
    },
    description: {
      type: String,
      required: [true, 'La description est requise'],
      trim: true,
      minlength: [10, 'La description doit contenir au moins 10 caractères'],
      maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères']
    },
    coverImage: {
      type: String,
      required: [true, 'L\'image de couverture est requise']
    },
    genre: {
      type: [String],
      required: [true, 'Au moins un genre est requis'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'Au moins un genre doit être sélectionné'
      }
    },
    language: {
      type: String,
      required: [true, 'La langue est requise'],
      enum: ['fr', 'en', 'ewe', 'yoruba', 'swahili', 'other'],
      default: 'fr'
    },
    tags: {
      type: [String],
      default: []
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    views: {
      type: Number,
      default: 0
    },
    likesCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    }
  },
  {
    timestamps: true
  }
);

// Index pour améliorer les performances
ComicSchema.index({ author: 1 });
ComicSchema.index({ status: 1 });
ComicSchema.index({ genre: 1 });
ComicSchema.index({ language: 1 });
ComicSchema.index({ createdAt: -1 });
ComicSchema.index({ views: -1 });
ComicSchema.index({ likesCount: -1 });

// Index de recherche textuelle
ComicSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.model<IComic>('Comic', ComicSchema);
