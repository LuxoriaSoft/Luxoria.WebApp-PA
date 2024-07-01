import { NextRequest, NextResponse } from "next/server";
import { GridFSBucket, ObjectId } from 'mongodb';
import {getDbInstance} from "@/lib/services/database.service";

export async function DELETE(request: NextRequest) {
  try {
    let db = await getDbInstance();

    const fileId = request.nextUrl.searchParams.get("_id");

    if (!fileId) {
      return NextResponse.json({ error: "fileId is missing" }, { status: 400 });
    }

    const objectId = new ObjectId(fileId);

    const bucket = new GridFSBucket(db);
    await bucket.delete(objectId);

    return NextResponse.json({ message: `File '${fileId}' deleted !` });
  } catch (error) {
    return NextResponse.json({ error: "Error during deletion !" }, { status: 500 });
  }
}
