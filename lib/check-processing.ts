export async function checkImageProcessing(url: string) {
    try {
        console.log("in function check : ", url)
        const resp = await fetch(url)
        console.log(resp)
        if (resp.ok) return true
        return false
    } catch (error) {
        console.log(error)
        return false
    }
}