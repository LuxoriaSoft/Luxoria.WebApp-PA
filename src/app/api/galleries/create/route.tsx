import {NextRequest, NextResponse} from "next/server";
import {getDbInstance} from "@/lib/services/database.service";

interface Gallery {
  name: string;
  description: string;
  email: string;
}

export async function POST(request: NextRequest) : Promise<void | Response> {
  try {
    let db = await getDbInstance();
    const body = await request.json() as Gallery;

    // Insert gallery into 'galleries' collection
    await db.collection("galleries").insertOne(body);

    return NextResponse.json({ success: "Gallery created successfully!", body  }, { status: 200 });

  } catch (error) {
    console.error("DB Connection error:", error);
    return NextResponse.json({ error: "DB Connection error!" }, { status: 500 });
  }
}
