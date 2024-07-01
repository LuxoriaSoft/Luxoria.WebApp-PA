import { NextRequest, NextResponse } from "next/server";
import { MongoClient, GridFSBucket, Db, ObjectId } from 'mongodb';

let db: Db;
let clientPromise: Promise<MongoClient>;

const initializeMongoClient = async () : Promise<MongoClient> => {
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

export async function GET(request: NextRequest, context : any) : Promise<void | Response> {
    try {
        const client = await initializeMongoClient();
        db = client.db('LuxorAI');

        const { params } = context;
        const fileId = params._id;

        if (!fileId) {
            return NextResponse.json({ error: "Missing file ID" }, { status: 400 });
        }

        let objectId: ObjectId;
        try {
            objectId = new ObjectId(fileId);
        } catch (error) {
            console.error("Error converting ID to ObjectId:", error);
            return NextResponse.json({ error: "Invalid file ID" }, { status: 400 });
        }

        const bucket = new GridFSBucket(db);
        const downloadStream = bucket.openDownloadStream(objectId);

        let filenameFromDB: string | undefined;

        try {
            const fileInfo = await bucket.find({ _id: objectId }).toArray();
            if (fileInfo.length > 0) {
                filenameFromDB = fileInfo[0].filename;
            } else {
                console.error("File not found in the database");
                return NextResponse.json({ error: "File not found in the database" }, { status: 404 });
            }
        } catch (error) {
            console.error("Error retrieving filename from the database:", error);
            return NextResponse.json({ error: "Error retrieving filename" }, { status: 500 });
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
                            'Content-Disposition': 'inline'
                        }
                    }));
                } else {
                    reject(NextResponse.json({ error: "Filename not available" }, { status: 500 }));
                }
            });

            downloadStream.on('error', (error) => {
                console.error("Error downloading the file:", error);
                reject(NextResponse.json({ error: "Error downloading the file" }, { status: 500 }));
            });
        });

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        return NextResponse.json({ error: "Error connecting to MongoDB" }, { status: 500 });
    }
}
