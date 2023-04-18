import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3'
import { Router } from 'express'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
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

imagesRoute.get('/images/:imageId', requireJWTAuth, async (req, res) => {
  try {
    const image = await Image.findById(req.params.imageId)
    if (image === null) {
      return res.status(404).json({ message: 'Image not found' })
    }
    const getCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `${image.userId}/${image.name}`,
    })
    const signedUrl = await getSignedUrl(s3Client, getCommand, {
      expiresIn: 60 * 60,
    })
    res.status(200).json({
      id: image.id,
      name: image.name,
      displayName: image.displayName,
      imageUrl: signedUrl,
      createdAt: image.createdAt,
    })
  } catch (error) {
    res.status(500).json({ message: error })
  }
})

imagesRoute.post('/images', upload.single('imageFile'), async (req, res) => {
  try {
    if (req.file === undefined) {
      return res.status(400).json({ message: 'File not valid' })
    }
    const { userId, displayName } = req.body
    if (!userId) {
      return res.status(400).json({ message: 'Invalid user id' })
    }
    const { originalname, buffer } = req.file
    const putCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `${userId}/${originalname}`,
      Body: buffer,
    })
    const response = await s3Client.send(putCommand)
    if (response.$metadata.httpStatusCode !== 200) {
      return res
        .status(response.$metadata.httpStatusCode || 400)
        .json({ message: 'Error occurred during putting file to S3' })
    }
    await Image.create({
      userId,
      name: originalname,
      displayName,
    })
    res.status(201).json({ message: 'Uploaded image successfully' })
  } catch (error) {
    res.status(500).json({ message: error })
  }
})

imagesRoute.delete('/images/:imageId', requireJWTAuth, async (req, res) => {
  try {
    const deletedImage = await Image.findByIdAndDelete(req.params.imageId)
    if (deletedImage === null) {
      return res.status(404).json({ message: 'Image not found' })
    }
    const deleteCommand = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `${deletedImage?.userId}/${deletedImage?.name}`,
    })
    const response = await s3Client.send(deleteCommand)
    if (response.$metadata.httpStatusCode !== 200) {
      return res
        .status(response.$metadata.httpStatusCode || 400)
        .json({ message: 'Error occurred during deleting S3 file' })
    }
    res.status(200).json({ message: 'Delete image successfully' })
  } catch (error) {
    res.status(500).json({ message: error })
  }
})

export { imagesRoute }
