import { NextRequest, NextResponse } from "next/server";
import { getDbInstance } from "@/lib/services/database.service";
import { ObjectId } from "mongodb";

export async function PUT(request: NextRequest) : Promise<void | Response> {
    try {
        let db = await getDbInstance();
        const { id, name, description, email } = await request.json();

        if (!id || !name || !description || !email) {
            console.error("Missing required fields", { id, name, description, email });
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const objectId = new ObjectId(id);

        const result = await db.collection("galleries").updateOne(
            { _id: objectId },
            { $set: { name, description, email } }
        );

        if (result.matchedCount === 0) {
            console.error("Gallery not found", { id });
            return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
        }

        const updatedGallery = await db.collection("galleries").findOne({ _id: objectId });

        return NextResponse.json({ success: "Gallery edited successfully!", body: updatedGallery }, { status: 200 });

    } catch (error) {
        console.error("DB Connection error:", error);
        return NextResponse.json({ error: "DB Connection error!" }, { status: 500 });
    }
}
