import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params: { roomCode }, url, fetch }) => {

    const res = await fetch(url.origin + `/create/room?roomCode=${roomCode}`,
        {
            method: 'GET',
        }
    )

    const { room, exists, isStudent } = await res.json()

    return {
        ...(room && { room }),
        ...(exists && { exists }),
        ...(isStudent && { isStudent })
    }
}