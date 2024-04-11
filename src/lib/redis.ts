import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: 'https://eu1-driving-gator-40447.upstash.io',
  token: process.env.REDIS_KEY!,
})
