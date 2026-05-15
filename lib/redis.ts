import { Redis } from '@upstash/redis';

// Upstash inyecta automáticamente KV_REST_API_URL y KV_REST_API_TOKEN
// (también funcionan UPSTASH_REDIS_REST_URL/TOKEN como fallback)
let redisInstance: Redis | null = null;

export function getRedis(): Redis {
  if (redisInstance) return redisInstance;

  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error('Faltan KV_REST_API_URL y KV_REST_API_TOKEN (conecta Upstash Redis en Vercel)');
  }

  redisInstance = new Redis({ url, token });
  return redisInstance;
}

// Como es app single-user usamos una sola key fija
export const CV_KEY = 'user:default:master_cv';
