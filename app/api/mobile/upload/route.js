export const runtime = "nodejs"; // REQUIRED for Cloudinary + streams

import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";

export async function POST(req) {
  try {
    console.log("📤 Upload endpoint hit");

    const formData = await req.formData();
    const files = formData.getAll("images");

    console.log("📦 Files received:", files.length);

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No images provided" },
        { status: 400 }
      );
    }

    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      console.log(`➡️ Processing file ${i + 1}/${files.length}`);
      console.log("   File type:", file.type);
      console.log("   File name:", file.name);

      // Convert to buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      console.log("   Buffer size:", buffer.length);

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "dating-app/messages",
            resource_type: "image",
            format: "jpg", // HEIC → JPG
            quality: "auto",
          },
          (error, result) => {
            if (error) {
              console.error("   ❌ Cloudinary error:", error);
              reject(error);
            } else {
              console.log("   ✅ Uploaded:", result.secure_url);
              resolve(result);
            }
          }
        );

        Readable.from(buffer).pipe(uploadStream);
      });

      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
      });
    }

    console.log("🎉 All uploads complete");

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
    console.error("💥 Upload failed:", err);

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
