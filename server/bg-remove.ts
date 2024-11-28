"use server"

import { checkImageProcessing } from "@/lib/check-processing"
import { actionClient } from "@/lib/safe-action"
import { v2 as cloudinary } from "cloudinary"
import z from "zod"

cloudinary.config({
    cloud_name: "druxpb8a5",
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
})

const bgRemovalSchema = z.object({
    activeImage: z.string(),
    format: z.string(),
})


export const bgRemoval = actionClient.schema(bgRemovalSchema)
    .action(async ({ parsedInput: { activeImage, format } }) => {

        const form = activeImage.split(format)
        const pngConvert = form[0] + "png"

        const parts = pngConvert.split("/upload/")
        const bgUrl = `${parts[0]}/upload/e_background_removal/${parts[1]}`

        // little check for the processing img
        let isProcessed = false
        const maxAttemps = 20
        const delay = 500

        for (let attempt = 0; attempt < maxAttemps; attempt++) {
            isProcessed = await checkImageProcessing(bgUrl)

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
        return { success: bgUrl }
    })