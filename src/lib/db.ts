import { Client, Entity, Schema } from 'redis-om'

// used in git vercel with env vars in UI
let {
    VITE_REDIS_URL,
} = process.env

// used in local .env dev build
if (!VITE_REDIS_URL) {
    ; ({
        VITE_REDIS_URL,
    } = import.meta.env)
}

interface Room {
    teacherId: string,
    createdAt: Date,
    expiresAt: Date,
    roomCode: string,
    students: string[]
}

class Room extends Entity {
    pushStudent(studentId: string, studentName: string) {
        this.students?.push(`${studentId}/${studentName}`)
    }

    updateStudent(studentId: string, newStudentName: string): boolean {
        const studentIdx = this.students?.findIndex(student =>
            student.split('/')[0] === studentId
        )
        if (studentIdx !== -1) {
            this.students[studentIdx] = `${studentId}/${newStudentName}`
            return true
        } else {
            return false
        }
    }

    removeStudent(studentId: string) {
        this.students = this.students.filter(student =>
            student.split('/')[0] !== studentId
        )
    }
}

const roomSchema = new Schema(Room, {
    teacherId: { type: 'string' },
    createdAt: { type: 'date' },
    expiresAt: { type: 'date' },
    roomCode: { type: 'string' },
    students: { type: 'string[]' }
})

export const redisClient = await new Client().open(VITE_REDIS_URL)

export const roomRepository = redisClient.fetchRepository(roomSchema)
