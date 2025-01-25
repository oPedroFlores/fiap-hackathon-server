import mongoose from 'mongoose';
import questionSchema from './questionSchema.js';

const testSchema = new mongoose.Schema({
  testCode: {
    type: String,
    required: true,
  },
  testName: {
    type: String,
    required: true,
  },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    // "disciplina"
    type: String,
    required: true,
  },
  testType: {
    type: String,
    required: true,
    enum: ['Online', 'Presencial'],
    default: 'Presencial',
  },
  maxScore: {
    type: String, // Pensar em mudar para 'number'
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Aguardando', 'Em andamento', 'Finalizada', 'Cancelada'],
  },
  grade: {
    // "turma"
    type: String,
    required: true,
  },
  topic: {
    // "assunto"
    type: String,
    required: true,
  },
  difficultyLevel: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard', 'Mixed'],
  },
  numberOfQuestions: {
    type: Number,
    required: true,
    min: 1,
  },
  questions: [questionSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  accessibility: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const Test = mongoose.model('Test', testSchema);

export default Test;
