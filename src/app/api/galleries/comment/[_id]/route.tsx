import {NextRequest, NextResponse} from "next/server";
import {getDbInstance} from "@/lib/services/database.service";
import {ObjectId} from "mongodb";

interface Comment {
  _id: ObjectId;
  title: string;
  content: string;
  postedAt: Date;
}

export async function POST(request: NextRequest, context : any) : Promise<void | Response> {
  let db = await getDbInstance();

  const { params } = context;
  const { _id } = params;
  const body = await request.json() as Comment;

  // Check if picture exists
  let mongoDBId = new ObjectId(_id);
  const picture = await db.collection("fs.files").findOne({ _id : mongoDBId });
  if (!picture) {
    return NextResponse.json({ error: "Picture not found" }, { status: 404 });
  }
  // Add postedAt field to the comment
  body.postedAt = new Date();

  // Insert comment into 'comments' collection and return the result
  const result = await db.collection("comments").insertOne({ ...body, galleryId: mongoDBId });

  return NextResponse.json({ success: result }, { status: 200 });
}

export async function GET(request: NextRequest, context : any) : Promise<void | Response> {
  let db = await getDbInstance();

  const { params } = context;
  const { _id } = params;

  let mongoDBId = new ObjectId(_id);
  const comments = await db.collection("comments").find({ galleryId : mongoDBId }).toArray();

  return NextResponse.json(comments, { status: 200 });
}