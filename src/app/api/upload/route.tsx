import {NextRequest, NextResponse} from "next/server";

export async function POST(request: NextRequest) {
    const data = await request.formData();
    const file: File | null = data.get("file") as File;

    if (!file) {
        return NextResponse.json({error: "No file uploaded"}, {status: 400});
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log(buffer);

    return NextResponse.json({size: buffer.length});
}

/*
curl -X POST http://localhost:3000/api/upload \
  -F "file=@/Users/quentin/Downloads/accept.png"
 */