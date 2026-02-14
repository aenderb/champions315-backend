import "dotenv/config";
import {z} from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRATION_TIME: z.string().default("15m"),
  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_EXPIRATION_TIME: z.string().default("7d"),
  CORS_ORIGIN: z.string().default("http://localhost:5173").transform((val) => val.split(",").map((s) => s.trim())),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  RATE_LIMIT_GENERAL_MAX: z.coerce.number().default(100),
  RATE_LIMIT_AUTH_MAX: z.coerce.number().default(5),
  RATE_LIMIT_SIGNUP_MAX: z.coerce.number().default(3),
});

export const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables.");
}

export const env = _env.data;