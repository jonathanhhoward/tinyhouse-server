import { MongoClient } from "mongodb";
import { Database } from "../lib/types";

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_CLSTR}.mongodb.net/main?retryWrites=true&w=majority`;

export async function connectDatabase(): Promise<Database> {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db("main");

  return {
    listings: db.collection("test_listings"),
  };
}
