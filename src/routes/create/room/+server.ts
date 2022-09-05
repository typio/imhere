import { v4 as uuidv4 } from 'uuid'
import * as cookie from 'cookie'

import { roomRepository } from '$lib/db'
import { codeLength } from '$lib/helper'

import type { RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ request, url: { searchParams } }) => {
    const teacherId = cookie.parse(request.headers.get('cookie') || '').teacherId

    const type = searchParams.get('type') ?? 'checkExists'
    const roomCode = searchParams.get('roomCode') ?? ''

    const room = (await roomRepository.search().where('roomCode').eq(roomCode).return.all())[0]

    const getterIsRoomOwner = room?.teacherId === teacherId

    switch (type) {
        case 'checkExists':
            return new Response(JSON.stringify({ exists: room?.entityId !== undefined }), { status: 200 })
        case 'getRoom':
            return new Response(JSON.stringify(getterIsRoomOwner ? { room } : { exists: room?.entityId !== undefined }), { status: 200 })
        default:
            return new Response(JSON.stringify({ message: 'invalid type param' }), { status: 400 })
    }
}

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json()
    const TTLInSeconds = <number>(body?.TTLInSeconds ?? 60 * 5)

    let teacherId = uuidv4()
    const randomCode = () => (Math.floor(Math.random() * (10 ** codeLength - 1)) + '').padStart(codeLength, '0')
    let roomCode = randomCode()

    // search for duplicate teacher ids
    const retryAttemptLimit = 100
    let retries = 0
    await roomRepository.createIndex()
    while ((await roomRepository.search().where('teacherId').eq(teacherId).return.all()).length !== 0) {
        teacherId = uuidv4()
        retries++
        if (retries > retryAttemptLimit)
            return new Response(JSON.stringify({
                message: 'failed to create unique teacher id',

            }), { status: 400 })
    }

    // search for duplicate room ids
    retries = 0
    while ((await roomRepository.search().where('roomCode').eq(roomCode).return.all()).length !== 0) {
        roomCode = randomCode()

        retries++
        if (retries > retryAttemptLimit)
            return new Response(JSON.stringify({
                message: 'failed to create unique room code',

            }), { status: 400 })
    }

    const createdAt = new Date()

    const room = await roomRepository.createAndSave({
        createdAt,
        expiresAt: new Date(createdAt.getTime() + (1000 * TTLInSeconds)),
        teacherId,
        roomCode,
        students: []
    })

    await roomRepository.expire(room.entityId, TTLInSeconds)

    return new Response(
        JSON.stringify({
            message: 'success',
            room
        }), {
        status: 200,
        headers: {
            'Set-Cookie': `teacherId=${teacherId}; Max-Age=${TTLInSeconds}; Path=/`
        }
    })
}

export const PATCH: RequestHandler = async ({ request }) => {
    const { code, name } = await request.json()

    const studentId = cookie.parse(request.headers.get('cookie') || '').studentId

    let room = (await roomRepository.search().where('roomCode').eq(code).return.all())[0]
    let studentExists = false
    room.students.forEach(student => {
        if (student.split('/')[0] === studentId) studentExists = true
    })

    if (studentExists) {
        // update existing student
        room.updateStudent(studentId, name)
        roomRepository.save(room)
        return new Response(JSON.stringify(room), {
            status: 200,
            headers: {
                'Set-Cookie': `studentId=${studentId}; Path=/`
            }
        })
    } else {
        // add new student
        const newStudentId = uuidv4()
        room.pushStudent(newStudentId, name)
        roomRepository.save(room)
        return new Response(JSON.stringify(room), {
            status: 200,
            headers: {
                'Set-Cookie': `studentId=${newStudentId}; Path=/`
            }
        })
    }
}

export const DELETE: RequestHandler = async ({ request }) => {
    const { roomCode, studentId } = await request.json()
    const teacherId = cookie.parse(request.headers.get('cookie') || '').teacherId

    let room = (await roomRepository.search().where('roomCode').eq(roomCode).return.all())[0]

    if (room.teacherId === teacherId) {
        room.removeStudent(studentId)
        roomRepository.save(room)

        return new Response(JSON.stringify(room), {
            status: 200,
        })
    } else {
        return new Response(JSON.stringify(room), {
            status: 401,
        })
    }
}