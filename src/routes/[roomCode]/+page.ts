import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params: { roomCode }, url, fetch }) => {

    const res = await fetch(url.origin + `/create/room?type=getRoom&roomCode=${roomCode}`,
        {
            method: 'GET',
        }
    )
    const { room, exists } = await res.json()
    
    return {
        ...(room && { room }),
        ...(exists && { exists })
    }
}