import mongoose from 'mongoose';
import { passwordEncryption } from '../Utils/UsersUtils.js';
const userSchema = new mongoose.Schema(
  {
    personalInfo: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
      },
      birthDate: {
        type: Date,
        required: true,
      },
      CPF: {
        type: String,
        required: true,
        unique: true,
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
          validator: function (v) {
            return /\S+@\S+\.\S+/.test(v);
          },
          message: 'Email inválido',
        },
      },
      gender: {
        type: String,
        required: true,
        enum: ['male', 'female'],
      },
      password: {
        type: String,
        required: true,
        minlength: 6,
      },
      role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'teacher',
        required: true,
      },
      image: {
        type: String,
        default: null,
      },
      status: {
        type: String,
        enum: ['active', 'inactive', 'deleted'],
        default: 'active',
        required: true,
      },
    },
    connectionInfo: {
      createdAtIP: {
        type: String,
        default: null,
      },
      updatedAtIP: {
        type: String,
        default: null,
      },
      deletedAtIP: {
        type: String,
        default: null,
      },
      lastLoginIP: {
        type: String,
        default: null,
      },
      lastLoginDate: {
        type: Date,
        default: null,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      deletedAt: {
        type: Date,
        default: null,
      },
    },
  },
  { timestamps: true },
);

//* Validação de senha
userSchema.pre('save', function (next) {
  if (this.personalInfo.password.length < 6) {
    return next(new Error('A senha deve ter pelo menos 6 caracteres.'));
  }

  this.personalInfo.password = passwordEncryption(this.personalInfo.password);

  next();
});

const User = mongoose.model('User', userSchema);

export default User;
