import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type UploadedFile = { secure_url: string; public_id: string; original_name: string; size: number };

export async function uploadFile(file: File): Promise<UploadedFile> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: 'opslogistics', resource_type: 'auto' }, (err, res) => {
        if (err || !res) reject(err ?? new Error('Upload failed'));
        else resolve(res);
      })
      .end(bytes);
  });
  return { secure_url: result.secure_url, public_id: result.public_id, original_name: file.name, size: file.size };
}

export async function deleteFile(publicId: string) {
  await cloudinary.uploader.destroy(publicId);
}

export function uploadSignature() {
  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request({ timestamp }, process.env.CLOUDINARY_API_SECRET as string);
  return {
    timestamp,
    signature,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  };
}
