"use server"

import { actionClient } from '@/lib/safe-action'
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary'
import z from 'zod'

cloudinary.config({
    cloud_name: "druxpb8a5",
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
})

const formData = z.object({
    image: z.instanceof(FormData),
})

type UploadResult =
    | { success: UploadApiResponse; error?: never }
    | { error: string; success?: never }

export const uploadImage = actionClient
    .schema(formData)
    .action(async ({ parsedInput: { image } }): Promise<UploadResult> => {
        console.log(image)
        const formImage = image.get('image')

        if (!formImage) return { error: "No image was provided." }
        if (!image) return { error: "No image was provided." }

        const file = formImage as File // 断言

        try {
            const arrayBuffer = await file.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)

            return new Promise<UploadResult>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        upload_preset: "ml_default",
                        use_filename: true,
                        unique_filename: false,
                        filename_override: file.name,
                    },
                    (error, result) => {
                        if (error || !result) {
                            return reject({ error: "Upload Failed" })
                        } else {
                            console.log("success", result)
                            resolve({ success: result })
                        }
                    })
                uploadStream.end(buffer)
            })
        } catch (error) {
            console.error("error processing file: ", error)
            return { error: "Upload Failed" }
        }
    })
