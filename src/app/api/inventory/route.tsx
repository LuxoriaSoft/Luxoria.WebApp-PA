import { NextRequest, NextResponse } from "next/server";
import { MongoClient, GridFSBucket, Db, ObjectId } from 'mongodb';

let db: Db;
let clientPromise: Promise<MongoClient>;
export const getFilesList = async () => {
    try {
        const client = await initializeMongoClient();
        db = client.db('LuxorAI');

        const bucket = new GridFSBucket(db);
        const files = await bucket.find().toArray();

        // Récupérer uniquement les noms des fichiers
        const fileNames = files.map(file => file.filename);

        return fileNames;
    } catch (error) {
        console.error("Erreur lors de la récupération de la liste des fichiers :", error);
        throw error;
    }
};
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

        // Récupérer la liste des fichiers
        const filesList = await getFilesList();

        return NextResponse.json({ files: filesList });
    } catch (error) {
        console.error("Erreur lors de la connexion à MongoDB :", error);
        return NextResponse.json({ error: "Erreur lors de la connexion à MongoDB" }, { status: 500 });
    }
}
