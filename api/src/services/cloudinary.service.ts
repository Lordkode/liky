import {
  v2 as cloudinary,
  UploadApiOptions,
  TransformationOptions,
} from "cloudinary";
import config from "../config/env";
import {
  InvalidUploadCredentialsError,
  CloudinaryUploadError,
  CloudinaryDeleteError,
  CloudinaryTransformError,
  CloudinaryInvalidFormatError
} from "../utils/errors/cloudinary-errors";
import { AppError } from "../utils/errors/app-error";

interface CloudinaryUploadResult {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  type: string;
  url: string;
  secure_url: string;
}

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
});
export class CloudinaryService {
  // Method
  // Method to Upload an image to cloudinary
  async uploadImage(
    path: string,
    options: UploadApiOptions = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      return await cloudinary.uploader.upload(path, options);
    } catch (error) {
      console.error("Error while upload to cloudinary : ", error);
      throw new CloudinaryUploadError("Erreur lors de l'upload vers Cloudinary");
    }
  }

  // Method to upload form data image
  async uploadFormDataImage(
    file: Express.Multer.File,
    options: UploadApiOptions = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      // Valider le type de fichier
      this.validateFileType(file);

      // Upload vers Cloudinary
      return await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
        ...options
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error("Error while upload to cloudinary:", error);
      throw new CloudinaryUploadError("Erreur lors de l'upload vers Cloudinary");
    }
  }

  // Method to generate an image url from cloudinary
  async downloadIamge(
    imageId: string,
    options: TransformationOptions = {}
  ): Promise<string> {
    try {
      const transformationOptions = {
        transformation: [
          { quality: "auto" },
          { fetch_format: "auto" },
          ...(Array.isArray(options) ? options : [options]),
        ],
      };

      return cloudinary.url(imageId, transformationOptions);
    } catch (error) {
      console.error("Error while generating image URL:", error);
      throw new CloudinaryTransformError("Erreur lors de la génération de l'URL de l'image");
    }
  }

  // Methode to delete an image from cloudinary
  async deleteImage(imageId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(imageId);
    } catch (error) {
      console.error("Error while deleting image from cloudinary:", error);
      throw new CloudinaryDeleteError("Erreur lors de la suppression de l'image");
    }
  }

  // Method to validate file type
  private validateFileType(file: Express.Multer.File) {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/jpg", "image/heic", "image/heif"];
    const fileType = file.mimetype;
    if (!allowedTypes.includes(fileType)) {
      throw new CloudinaryInvalidFormatError("Type de fichier non supporté");
    }
  }
}
