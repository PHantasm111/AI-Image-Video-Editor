export async function checkImageProcessing(url: string) {
    try {
        const resp = await fetch(url)
        if (resp.ok) return true
        return false
    } catch (error) {
        return false
    }
}