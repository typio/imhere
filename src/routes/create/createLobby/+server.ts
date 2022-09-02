export const POST = () => {
    console.log('hi')

    return new Response(JSON.stringify({ message: 'success' }))
}