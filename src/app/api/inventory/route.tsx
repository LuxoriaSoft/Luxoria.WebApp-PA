import { NextRequest, NextResponse } from "next/server";
import { GridFSBucket, ObjectId } from 'mongodb';
import {getDbInstance} from "@/lib/services/database.service";

interface FileDetail {
    _id: ObjectId;
    filename: string;
}

const getFilesList = async () : Promise<FileDetail[]>  => {
    try {
        let db = await getDbInstance();

        const bucket = new GridFSBucket(db);
        const files = await bucket.find().toArray();
        const fileDetails = files.map(file => ({ _id: file._id, filename: file.filename }));

        return fileDetails;
    } catch (error) {
        console.error("Erreur lors de la récupération de la liste des fichiers :", error);
        throw error;
    }
};

export async function GET(request: NextRequest) {
    try {
        let db = await getDbInstance();

        const filesList = await getFilesList();

        return NextResponse.json({ files: filesList });
    } catch (error) {
        console.error("Erreur lors de la connexion à MongoDB :", error);
        return NextResponse.json({ error: "Erreur lors de la connexion à MongoDB" }, { status: 500 });
    }
}
