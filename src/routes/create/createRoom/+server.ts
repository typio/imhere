import { roomRepository } from '$lib/db'
import { codeLength } from '$lib/helper'

import type { RequestHandler } from '@sveltejs/kit'
import { v4 as uuidv4 } from 'uuid'

export const POST: RequestHandler = async ({ params }) => {
    const TTLInSeconds = <number>(params?.TTLInSeconds ?? 60 * 60)

    let teacherId = uuidv4()
    let roomCode = Math.floor(Math.random() * (10 ** codeLength - 1))

    // search for duplicate teacher ids
    const retryAttemptLimit = 100
    let retries = 0
    await roomRepository.createIndex()
    while ((await roomRepository.search().where('teacherId').equals(teacherId).return.all()).length !== 0) {
        teacherId = uuidv4()
        retries++
        if (retries > retryAttemptLimit)
            return new Response(JSON.stringify({
                message: 'failed to create unique teacher id',

            }), { status: 400 })
    }

    // search for duplicate room ids
    retries = 0
    while ((await roomRepository.search().where('roomCode').equals(roomCode).return.all()).length !== 0) {
        roomCode = Math.floor(Math.random() * (10 ** codeLength - 1))

        retries++
        if (retries > retryAttemptLimit)
            return new Response(JSON.stringify({
                message: 'failed to create unique room code',

            }), { status: 400 })
    }

    const room = await roomRepository.createAndSave({
        createdAt: new Date(),
        teacherId,
        roomCode
    })

    await roomRepository.expire(room.entityId, TTLInSeconds)

    return new Response(
        JSON.stringify({
            message: 'success',
            room
        }), {
        status: 200,
        headers: {
            'Set-Cookie': `teacherId=${teacherId}; Max-Age=${TTLInSeconds}`
        }
    }
    )
}