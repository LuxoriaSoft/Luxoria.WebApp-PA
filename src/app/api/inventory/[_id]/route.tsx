// /pages/api/files.ts

import { NextRequest, NextResponse } from "next/server";
import { GridFSBucket, ObjectId } from 'mongodb';
import { getDbInstance } from "@/lib/services/database.service";

interface FileDetail {
    _id: ObjectId;
    filename: string;
    relatedToGalleryID: string | null;
}

const getFilesList = async (galleryId: string): Promise<FileDetail[]> => {
    try {
        let db = await getDbInstance();

        const bucket = new GridFSBucket(db);
        const files = await bucket.find({ 'metadata.relatedToGallery': new ObjectId(galleryId) }).toArray();
        const fileDetails = files.map(file => (
          {
              _id: file._id,
              filename: file.filename,
              relatedToGalleryID: file.metadata?.relatedToGallery || null
          }
        ));

        return fileDetails;
    } catch (error) {
        console.error("Erreur lors de la récupération de la liste des fichiers :", error);
        throw error;
    }
};

export async function GET(request: NextRequest, context : any) {
    try {
        const {params} = context;
        const galleryId = params._id;
        const { searchParams } = new URL(request.url);

        if (!galleryId) {
            return NextResponse.json({ error: "galleryId is required" }, { status: 400 });
        }

        const filesList = await getFilesList(galleryId);

        return NextResponse.json({ files: filesList });
    } catch (error) {
        console.error("Erreur lors de la connexion à MongoDB :", error);
        return NextResponse.json({ error: "Erreur lors de la connexion à MongoDB" }, { status: 500 });
    }
}
