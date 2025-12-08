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
  console.log("ENTERING UPLOAD");
  const formData = await req.formData();
  const files = formData.getAll("images");

  const uploadedImages = [];

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = bufferToStream(buffer);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "dating-app/profiles" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    uploadedImages.push({
      url: result.secure_url,
      public_id: result.public_id,
    });
  }

  return NextResponse.json({ images: uploadedImages });
}
