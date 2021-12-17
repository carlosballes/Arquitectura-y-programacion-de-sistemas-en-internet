import { Db, MongoClient } from "mongodb";

export const connectDB = async (): Promise<Db> => {
  const usr = "Carlos";
  const pwd = "pipo";
  const dbName: string = "Carlos";
  const mongouri: string = `mongodb+srv://${usr}:${pwd}@cluster0.ueeyw.mongodb.net/${dbName}?retryWrites=true&w=majority`;
  

  const client = new MongoClient(mongouri);

  try {
    await client.connect();
    console.info("MongoDB connected");
    //console.log(client.db(dbName))
    return client.db(dbName);
  } catch (e) {
    throw e;
  }
};