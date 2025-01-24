import express from 'express';
import cors from 'cors';
import UserRouters from './Routers/UserRouters.js';
import QuestionRouters from './Routers/QuestionRouters.js';
const app = express();
app.use(cors());
app.use(express.json());

// Iniciando dados

app.use('/users', UserRouters);
app.use('/questions', QuestionRouters);

export default app;
