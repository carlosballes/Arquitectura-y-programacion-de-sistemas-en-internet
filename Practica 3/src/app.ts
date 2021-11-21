import express, { Router } from 'express';
import { connectDB } from "./mongo";
import controller from './resolvers';
import { Collection, Db, MongoClient, ObjectId} from "mongodb";
import uuid4 from "uuid4";
import bodyParser from 'body-parser';
const uri = "mongodb+srv://Carlos:pipo@cluster0.ueeyw.mongodb.net/Carlos?retryWrites=true&w=majority";
const run = async() =>{
    const db: Db = await connectDB();
    const router = express();
    router.use(bodyParser.json())
    router.set("db",db)
    router.get('/posts', controller.status);
    router.post('/registrar', controller.registrar);
    router.post('/login', controller.login);
    router.use((req, res, next) => {
        console.log(req.headers.token || "No token");   
        if(req.headers.token){
            const client = new MongoClient(uri)
            client.connect().then(async (db) =>{
                const collection = client.db("Carlos").collection("Usuarios");
                const usuario = await collection.findOne({token:req.headers.token});
                console.log(usuario) 
                client.close();  
                if(usuario){return next()} else{res.status(401).send("Token no valido")}                
            })
        }else{
            res.status(401).send("No va") 
        }
    
    });
    router.post('/logout', controller.logout);
    router.get('/freeSeats', controller.freeSeats);
    router.post('/book', controller.book);
    router.post('/free', controller.free);
    router.get('/mybookings', controller.mybookings);

   
    await router.listen(3000);
};
try{
    run();
}catch(e){
    console.error(e);
}

