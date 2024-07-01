import { NextRequest, NextResponse } from "next/server";
import { getDbInstance } from "@/lib/services/database.service";
import { ObjectId, Document } from "mongodb";

interface Gallery {
  _id: ObjectId;
  name: string;
  description: string;
  email: string;
}

const getGalleries = async (): Promise<Gallery[]> => {
  try {
    const db = await getDbInstance();

    // Get all galleries from 'galleries' collection
    const documents: Document[] = await db.collection("galleries").find().toArray();
    const galleries: Gallery[] = documents as Gallery[];

    return galleries;
  } catch (error) {
    console.error("Error fetching galleries:", error);
    throw error;
  }
};

export async function GET(request: NextRequest) : Promise<void | Response> {
  try {
    const galleriesList = await getGalleries();

    return NextResponse.json({ galleries: galleriesList });
  } catch (error) {
    console.error("DB Connection error:", error);
    return NextResponse.json({ error: "DB Connection error!" }, { status: 500 });
  }
}
