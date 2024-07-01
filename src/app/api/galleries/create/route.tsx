import {NextRequest, NextResponse} from "next/server";

export async function POST(request: NextRequest) : Promise<void | Response> {
  try {

    return NextResponse.json({ success: "ABC!" }, { status: 200 });
  } catch (error) {
    console.error("DB Connection error:", error);
    return NextResponse.json({ error: "DB Connection error!" }, { status: 500 });
  }
}
