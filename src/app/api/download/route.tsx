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

export async function GET(request: NextRequest) {
    try {
        const client = await initializeMongoClient();
        db = client.db('LuxorAI');

        // Log de l'URL de la requête pour le débogage
        console.log("Request URL:", request.url);
        console.log("Query parameters:", request.nextUrl.searchParams);

        const fileId = request.nextUrl.searchParams.get("_id");

        if (!fileId) {
            return NextResponse.json({ error: "ID de fichier manquant" }, { status: 400 });
        }

        let objectId: ObjectId;
        try {
            objectId = new ObjectId(fileId);
        } catch (error) {
            console.error("Erreur lors de la conversion de l'ID en ObjectId :", error);
            return NextResponse.json({ error: "ID de fichier invalide" }, { status: 400 });
        }

        const bucket = new GridFSBucket(db);
        const downloadStream = bucket.openDownloadStream(objectId);

        const chunks: Buffer[] = [];
        downloadStream.on('data', (chunk) => {
            chunks.push(chunk);
        });

        return new Promise((resolve, reject) => {
            downloadStream.on('end', () => {
                const buffer = Buffer.concat(chunks);
                resolve(new NextResponse(buffer, {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/octet-stream',
                        'Content-Disposition': `attachment; filename=${fileId}`
                    }
                }));
            });

            downloadStream.on('error', (error) => {
                console.error("Erreur lors du téléchargement du fichier :", error);
                reject(NextResponse.json({ error: "Erreur lors du téléchargement du fichier" }, { status: 500 }));
            });
        });

    } catch (error) {
        console.error("Erreur lors de la connexion à MongoDB :", error);
        return NextResponse.json({ error: "Erreur lors de la connexion à MongoDB" }, { status: 500 });
    }
}
