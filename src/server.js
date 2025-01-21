import app from './app.js';
import dotenv from 'dotenv';
import { connectDB } from './db.js';

// Carrega as variáveis de ambiente
dotenv.config();

const PORT = process.env.PORT || 8090;

app
  .listen(PORT, () => {
    console.log(`{ SERVER } Running server on port ${PORT}`);
  })
  .on('error', (err) => {
    console.error('{ SERVER-ERROR } Error running server: ', err);
  });

// Conecta ao banco de dados
connectDB();
