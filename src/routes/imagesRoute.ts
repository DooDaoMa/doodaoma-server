import { PutObjectCommand } from '@aws-sdk/client-s3'
import { Router } from 'express'
import { BUCKET_NAME } from '../config/constant.config'
import { requireJWTAuth } from '../config/jwt.config'
import { upload } from '../config/multer.config'
import { s3Client } from '../config/s3.config'
import { Image } from '../models/image'

const imagesRoute = Router()

imagesRoute.get('/images', requireJWTAuth, async (req, res) => {
  try {
    const images = await Image.find()
    res.status(200).json(images)
  } catch (error) {
    res.status(500).json({ message: error })
  }
})

imagesRoute.post('/images', upload.single('imageFile'), async (req, res) => {
  try {
    if (req.file === undefined) {
      return res.status(400).json({ message: 'File not valid' })
    }
    const { userId } = req.body
    if (!userId) {
      return res.status(400).json({ message: 'Invalid user id' })
    }
    const { originalname, buffer } = req.file
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `${userId}/${originalname}`,
      Body: buffer,
    })
    const response = await s3Client.send(command)
    if (response.$metadata.httpStatusCode !== 200) {
      return res
        .status(response.$metadata.httpStatusCode || 400)
        .json({ message: 'Error occurred during putting file to S3' })
    }
    await Image.create({
      userId,
      name: originalname,
    })
    res.status(201).json({ message: 'Uploaded image successfully' })
  } catch (error) {
    res.status(500).json({ message: error })
  }
})

export { imagesRoute }
