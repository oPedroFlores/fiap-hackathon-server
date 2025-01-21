import express from 'express';
import cors from 'cors';
import UserRouters from './Routers/UserRouters.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/users', UserRouters);

export default app;
