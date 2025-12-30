import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";

function bufferToStream(buffer) {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
}

export async function POST(req) {
  const formData = await req.formData();
  const files = formData.getAll("images");

  const uploadedImages = [];

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = bufferToStream(buffer);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "dating-app/messages",
          resource_type: "image",
          format: "jpg",       // forces HEIC → JPG
          quality: "auto",
        },
        (error, result) => {   // ✅ THIS is the callback
          if (error) reject(error);
          else resolve(result);
        }
      );

      // ✅ THIS sends the image to Cloudinary
      stream.pipe(uploadStream);
    });

    uploadedImages.push({
      url: result.secure_url,
      public_id: result.public_id,
    });
  }

  return NextResponse.json({ images: uploadedImages });
}
