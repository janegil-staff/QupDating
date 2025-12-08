import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    console.log("ENTERING UPLOAD");
    const formData = await req.formData();
    const files = formData.getAll("images");

    const uploadedImages = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "dating-app/profiles" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    return NextResponse.json(
      { images: uploadedImages },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Upload failed", details: err.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}
