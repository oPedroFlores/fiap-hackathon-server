import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Carrega as variáveis de ambiente
const mongoURL = process.env.MONGO_URL;

export const connectDB = async () => {
  console.log('{ DATABASE } Connecting to MongoDB...');
  try {
    const conn = await mongoose.connect(mongoURL);
    console.log(`{ DATABASE } MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`{ DATABASE-ERROR } Error: ${error.message}`);
    process.exit(1); // Encerra o processo caso ocorra um erro
  }
};
