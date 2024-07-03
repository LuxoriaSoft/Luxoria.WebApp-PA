import {NextRequest, NextResponse} from "next/server";
import {getDbInstance} from "@/lib/services/database.service";
import {ObjectId} from "mongodb";

export async function DELETE(request: NextRequest, context : any) : Promise<void | Response> {
  let db = await getDbInstance();

  const { params } = context;
  const { _id } = params;

  let mongoDBId = new ObjectId(_id);

  const result = await db.collection("galleries").deleteOne({ _id : mongoDBId });

  return NextResponse.json({ success: result, _id }, { status: 200 });
}