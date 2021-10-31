import { MongoClient} from "mongodb";

const connectMongo = async(url:string)=>{
    const client = new MongoClient(url);
    return client.connect();
}

export {connectMongo};