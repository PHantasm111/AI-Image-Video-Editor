"use server"

import { checkImageProcessing } from '@/lib/check-processing'
import { actionClient } from '@/lib/safe-action'
import { v2 as cloudinary } from 'cloudinary'
import z from 'zod'


cloudinary.config({
    cloud_name: "druxpb8a5",
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
})


const genRemoveSchema = z.object({
    prompt: z.string(),
    activeImage: z.string(),
})

export const genRemove = actionClient.schema(genRemoveSchema)
    .action(async ({ parsedInput: { activeImage, prompt } }) => {
        // https://res.cloudinary.com/demo/image/upload/e_gen_remove:prompt_the person/docs/horse-with-rider.jpg
        const parts = activeImage.split('/upload/')
        const removeUrl = `${parts[0]}/upload/e_gen_remove:${prompt}/${parts[1]}`

        // little check for the processing img
        let isProcessed = false
        const maxAttemps = 20
        const delay = 500

        for (let attempt = 0; attempt < maxAttemps; attempt++) {
            isProcessed = await checkImageProcessing(removeUrl)

            // if the image is processed
            if (isProcessed) break
            // waiting...
            await new Promise((resolve) => setTimeout(resolve, delay))
        }
        
        // if the image is not processed
        if (!isProcessed) {
            throw new Error("Image processing time out")
        }
        // if the image is processed
        return { success: removeUrl }
    })
