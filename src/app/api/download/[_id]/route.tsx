import { NextRequest, NextResponse } from "next/server";
import {getDbInstance} from "@/lib/services/database.service";
import {GridFSBucket, ObjectId} from "mongodb";

export async function GET(request: NextRequest, context : any) : Promise<void | NextResponse> {
    try {
        let db = await getDbInstance();

        const { params } = context;
        const fileId = params._id;

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

        let filenameFromDB: string | undefined;

        try {
            const fileInfo = await bucket.find({ _id: objectId }).toArray();
            if (fileInfo.length > 0) {
                filenameFromDB = fileInfo[0].filename;
            } else {
                console.error("Fichier non trouvé dans la base de données");
                return NextResponse.json({ error: "Fichier non trouvé dans la base de données" }, { status: 404 });
            }
        } catch (error) {
            console.error("Erreur lors de la récupération du nom de fichier depuis la base de données :", error);
            return NextResponse.json({ error: "Erreur lors de la récupération du nom de fichier" }, { status: 500 });
        }

        const chunks: Buffer[] = [];
        downloadStream.on('data', (chunk) => {
            chunks.push(chunk);
        });

        return new Promise((resolve, reject) => {
            downloadStream.on('end', () => {
                const buffer = Buffer.concat(chunks);
                if (filenameFromDB) {
                    resolve(new NextResponse(buffer, {
                        status: 200,
                        headers: {
                            'Content-Type': 'application/octet-stream',
                            'Content-Disposition': `attachment; filename="${filenameFromDB}"`
                        }
                    }));
                } else {
                    reject(NextResponse.json({ error: "Nom de fichier non disponible" }, { status: 500 }));
                }
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
