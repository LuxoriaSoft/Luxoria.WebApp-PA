import { NextRequest, NextResponse } from "next/server";
import {getDbInstance} from "@/lib/services/database.service";
import {GridFSBucket} from "mongodb";

export async function POST(request: NextRequest) {
    try {
        let db = await getDbInstance();

        const data = await request.formData();
        const file = data.get("file");
        const relatedToGallery = data.get("relatedToGallery");


        if (!file || !(file instanceof File)) {
            return NextResponse.json({ error: "Aucun fichier uploadé ou format invalide" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const bucket = new GridFSBucket(db);
        const uploadStream = bucket.openUploadStream(file.name, {
            metadata: {
                relatedToGallery: relatedToGallery || null,
                isLiked: false
            }
        });

        uploadStream.end(buffer);

        const uploadResult = await new Promise((resolve, reject) => {
            uploadStream.on('finish', () => {
                resolve(uploadStream.id);
            });

            uploadStream.on('error', (error: Error) => {
                reject(error);
            });
        });

        console.log(`Fichier sauvegardé avec l'ID : ${uploadResult}`);

        return NextResponse.json({ fileId: uploadResult });
    } catch (error) {
        console.error("Erreur lors de l'upload du fichier dans MongoDB :", error);
        return NextResponse.json({ error: "Échec de l'upload du fichier" }, { status: 500 });
    }
}
