import mongoose from 'mongoose'
import { db } from '../config/database.config'

// Define a schema
const Schema = mongoose.Schema

// Compile model from schema
export const User = db.model(
  'User',
  new Schema({
    username: String,
    password: String,
    email: String,
  }),
)
