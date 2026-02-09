import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("images");

    console.log("📤 Upload endpoint called");
    console.log("📋 Files received:", files.length);

    if (files.length === 0) {
      return NextResponse.json(
        { error: "No images provided" },
        { status: 400 }
      );
    }

    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`📤 Processing image ${i + 1}/${files.length}`);
      
      const buffer = Buffer.from(await file.arrayBuffer());
      console.log(`   Buffer size: ${buffer.length} bytes`);

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "dating-app/messages",
            resource_type: "image",
            format: "jpg", // forces HEIC → JPG
            quality: "auto",
          },
          (error, result) => {
            if (error) {
              console.error(`   ❌ Upload error:`, error);
              reject(error);
            } else {
              console.log(`   ✅ Uploaded:`, result.secure_url);
              resolve(result);
            }
          }
        );

        // Convert buffer to stream and pipe to Cloudinary
        const stream = Readable.from(buffer);
        stream.pipe(uploadStream);
      });

      uploadedImages.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    console.log("✅ All images uploaded successfully");
    console.log("📋 URLs:", uploadedImages.map(img => img.url));

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
    console.error("💥 Upload error:", err);
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
