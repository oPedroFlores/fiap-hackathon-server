import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  statement: { // "enunciado"
    type: String,
    required: true,
  },
  alternatives: [
    {
      text: {
        type: String,
        required: true,
      },
      isCorrect: { // "correta"
        type: Boolean,
        required: true,
      },
    },
  ],
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
  accessibility: {
    type: String,
    enum: ['Yes', 'No'], 
    required: true,
  },
  accessibilityDescription: {
    type: String,
    default: '',
  },
});

const testSchema = new mongoose.Schema({
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: { // "disciplina"
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  class: { // "turma"
    type: String,
    required: true,
  },
  topic: { // "assunto"
    type: String,
    required: true,
  },
  difficultyLevel: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard'],
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
});

const Test = mongoose.model('Test', testSchema);

export default Test;