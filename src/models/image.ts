import { Schema } from 'mongoose'
import { db } from '../config/database.config'
import { IImage } from '../types/image.types'

const ImageSchema = new Schema({
  name: String,
  userId: String,
})

export const Image = db.model<IImage>('Image', ImageSchema)
