export interface ICloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<{ secure_url: string; public_id: string   }>
  deleteFile(publicId: string): Promise<void>
}