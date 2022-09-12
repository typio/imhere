import { v4 as uuidv4 } from 'uuid'
import * as cookie from 'cookie'
import Filter from 'bad-words'

import { roomRepository } from '$lib/db'
import { codeLength } from '$lib/helper'

import type { RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ request, url }) => {

    const teacherId = cookie.parse(request.headers.get('cookie') || '').teacherId
    const studentId = cookie.parse(request.headers.get('cookie') || '').studentId

    const roomCode = url.searchParams.get('roomCode') ?? ''

    const room = (await roomRepository.search().where('roomCode').eq(roomCode).return.all())[0]

    const getterIsRoomOwner = room?.teacherId === teacherId
    const getterIsStudent = room?.students?.findIndex((student) => studentId === student.split('/')[0]) !== -1

    return new Response(
        JSON.stringify({
            room: (getterIsRoomOwner ? room : undefined),
            exists: ((room?.roomCode !== undefined) ? true : false),
            isStudent: (getterIsStudent ? true : false),
        }
        ),
        { status: 200 })
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

    const filter = new Filter()
    if (name.replace(' ', '').length === 0) {
        return new Response(JSON.stringify({ message: "Name must have characters" }), { status: 400 })
    } else if (filter.isProfane(name))
        return new Response(JSON.stringify({ message: "Name can't be profane" }), { status: 400 })

    const studentId = cookie.parse(request.headers.get('cookie') || '').studentId

    let room = (await roomRepository.search().where('roomCode').eq(code).return.all())[0]

    if (room?.students === undefined)
        return new Response(JSON.stringify({ message: 'didn\'t find room' }), { status: 404 })

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