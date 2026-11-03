import { Schema, model, HydratedDocument, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export const ROLES = ['user', 'admin'] as const;
export type Role = (typeof ROLES)[number];

export interface IUser {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: Role;
  /** Bumped on logout / password change to invalidate all refresh tokens. */
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

interface IUserMethods {
  comparePassword(candidate: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<IUser, IUserMethods>;
type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ROLES, default: 'user' },
    tokenVersion: { type: Number, default: 0, select: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.tokenVersion;
        return ret;
      },
    },
  },
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User = model<IUser, UserModel>('User', userSchema);
