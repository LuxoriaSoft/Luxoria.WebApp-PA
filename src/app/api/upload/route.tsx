import { NextRequest, NextResponse } from "next/server";
import { MongoClient, GridFSBucket, Db } from 'mongodb';

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

// Fonction pour gérer les requêtes POST
export async function POST(request: NextRequest) {
    try {
        const client = await initializeMongoClient();
        db = client.db('LuxorAI');

        const data = await request.formData();
        const file = data.get("file");

        if (!file || !(file instanceof File)) {
            return NextResponse.json({ error: "Aucun fichier uploadé ou format invalide" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const bucket = new GridFSBucket(db);
        const uploadStream = bucket.openUploadStream(file.name);

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
