import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firebaseUid: string;
  username: string;
  email: string;
  password?: string; // Optionnel pour rétrocompatibilité (anciens utilisateurs JWT)
  emailVerified: boolean;
  role: 'origun' | 'orifan';
  bio?: string;
  avatar?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firebaseUid: {
      type: String,
      required: [true, 'Firebase UID est requis'],
      unique: true,
      index: true
    },
    username: {
      type: String,
      required: [true, 'Le nom d\'utilisateur est requis'],
      unique: true,
      trim: true,
      minlength: [3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'],
      maxlength: [30, 'Le nom d\'utilisateur ne peut pas dépasser 30 caractères']
    },
    email: {
      type: String,
      required: [true, 'L\'email est requis'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Veuillez fournir un email valide']
    },
    password: {
      type: String,
      required: false, // Optionnel pour Firebase auth
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
    },
    emailVerified: {
      type: Boolean,
      default: false,
      required: true
    },
    role: {
      type: String,
      enum: ['origun', 'orifan'],
      default: 'orifan',
      required: true
    },
    bio: {
      type: String,
      maxlength: [500, 'La bio ne peut pas dépasser 500 caractères'],
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    },
    country: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Les index sont créés automatiquement par 'unique: true'

export default mongoose.model<IUser>('User', UserSchema);
