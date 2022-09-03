import { Client, Entity, Schema } from 'redis-om'

// used in git vercel with env vars in UI
let {
    VITE_REDIS_PORT,
    VITE_REDIS_HOST,
    VITE_REDIS_PASSWORD,
    VITE_REDIS_URL,
} = process.env

// used in local .env dev build
if (!VITE_REDIS_PORT) {
    ; ({
        VITE_REDIS_PORT,
        VITE_REDIS_HOST,
        VITE_REDIS_PASSWORD,
        VITE_REDIS_URL,
    } = import.meta.env)
}
console.log(VITE_REDIS_URL)

class Room extends Entity { }

const roomSchema = new Schema(Room, {
    teacherId: { type: 'string' },
    createdAt: { type: 'date' },
    roomCode: { type: 'number' },
    students: { type: 'string[]' }
})

export const redisClient = await new Client().open(VITE_REDIS_URL)

export const roomRepository = redisClient.fetchRepository(roomSchema)
