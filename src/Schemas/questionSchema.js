import mongoose from 'mongoose';

const alternativeSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true, // Agora configurado corretamente
  },
});

const questionSchema = new mongoose.Schema({
  statement: {
    // "enunciado"
    type: String,
    required: true,
  },
  isPublic: {
    type: Boolean,
    required: true,
  },
  img: {
    type: String,
    default: '',
    required: false,
  },
  alternatives: {
    type: [alternativeSchema], // Referência ao sub-schema
    required: true, // O array de alternativas deve ser obrigatório
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3,
  },
  subject: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Mixed'],
    required: true,
  },
  accessibility: {
    type: Boolean,
    required: true,
  },
  accessibilityDescription: {
    type: String,
    default: '',
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default questionSchema;
