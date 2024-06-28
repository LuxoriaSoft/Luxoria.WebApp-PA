import { NextRequest, NextResponse } from "next/server";
import { MongoClient, GridFSBucket, Db, ObjectId } from 'mongodb';

let db: Db;
let clientPromise: Promise<MongoClient>;

const initializeMongoClient = async () => {
  if (!clientPromise) {
    const uri = "mongodb+srv://Luxor:LuxorIA@luxoria.l9osito.mongodb.net/?appName=LuxorIA";
    const client = new MongoClient(uri, {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    });
    clientPromise = client.connect();
  }
  return clientPromise;
};

export async function DELETE(request: NextRequest) {
  try {
    const client = await initializeMongoClient();
    db = client.db('LuxorAI');

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
