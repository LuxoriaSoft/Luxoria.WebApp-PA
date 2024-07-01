import { Db, MongoClient } from "mongodb";

let db: Db;
let clientPromise: Promise<MongoClient>;

export const initializeMongoClient = async (): Promise<MongoClient> => {
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

export const getDbInstance = async (): Promise<Db> => {
  if (!db) {
    const client = await initializeMongoClient();
    db = client.db('LuxorAI');
  }
  return db;
};
