import { v2 as cloudinary } from "cloudinary";
import { env } from "@/env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

/**
 * Faz upload de um buffer para o Cloudinary.
 * @param fileBuffer - Buffer do arquivo (vem do multer memoryStorage)
 * @param folder - Pasta no Cloudinary (ex: "avatars", "players")
 * @returns URL segura da imagem hospedada
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string
): Promise<string> {
  console.log(`[Cloudinary] Iniciando upload para champions315/${folder} (${(fileBuffer.length / 1024).toFixed(1)} KB)`);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `champions315/${folder}`,
          resource_type: "image",
          transformation: [
            { width: 400, height: 400, crop: "fill", gravity: "face" },
            { quality: "auto", fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error || !result) {
            console.error("[Cloudinary] Erro no upload:", error?.message ?? "Resultado vazio");
            return reject(error ?? new Error("Falha no upload para Cloudinary"));
          }
          console.log(`[Cloudinary] Upload concluído: ${result.secure_url}`);
          resolve(result.secure_url);
        }
      )
      .end(fileBuffer);
  });
}

export { cloudinary };
