import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import { Collection, Db, MongoClient, ObjectId} from "mongodb";
import { json } from 'stream/consumers';
import { param } from '../routes/posts';
const uri = "mongodb+srv://Carlos:pipo@cluster0.ueeyw.mongodb.net/Carlos?retryWrites=true&w=majority";
const client = new MongoClient(uri)

interface Character {
    id: Number,
    name: string,
    status:string,
    species:string,
    episode:[Episode],
}

type Episode ={
    name:string,
    episode:string,
}


const getStatus = async( req:Request, res:Response, next:NextFunction)=>{
    try{
    return res.status(200).json({
        message : "OKProgramacion-I"
    })
    }catch(e){
        return res.status(500).json({
            message : "Error"
        })
    }
};


const getCharacters = async( req:Request, res:Response, next:NextFunction)=>{
    const client = new MongoClient(uri)
    client.connect().then(async (db) =>{
        const collection = client.db().collection("Rick y Morty");
        const results = await collection.find({}, {projection:{_id:0}}).toArray();
        return res.status(200).json({
            message : results
        });
    })
    client.close();
};

const getCharacterId = async( req:Request, res:Response, next:NextFunction)=>{
    const client = new MongoClient(uri)
    client.connect().then(async (db) =>{
        const collection = client.db().collection("Rick y Morty");
        const personaje = await collection.findOne({id:parseInt(req.params.id)});
        console.log(req.params)       
        return res.status(200).json({
            message : personaje           
        });
        
    })
    client.close();
};

const putSwichStatus= async( req:Request, res:Response, next:NextFunction)=>{
    const client = new MongoClient(uri)
    let i:number;
    client.connect().then(async (db) =>{
        const collection = client.db().collection("Rick y Morty");
        const personaje = await collection.findOne({id:parseInt(req.params.id)})
        if(personaje!=null){
            switch(personaje.status){
                case "Alive":
                    await collection.updateOne({id:parseInt(req.params.id)},{$set:{status:"Dead"}})
                    break;
                case "Dead":
                    await collection.updateOne({id:parseInt(req.params.id)},{$set:{status:"Alive"}})
                    break;
            }
                       
        return res.status(200).json({
            message :  await collection.findOne({id:parseInt(req.params.id)})
            
        });
        }else{
            return res.status(404).json({
                message : "Not found"
            });  
        }
    })
    client.close();
};

const deleteCharacter = async( req:Request, res:Response, next:NextFunction)=>{
    const client = new MongoClient(uri)
    let i:number;
    client.connect().then(async (db) =>{
        const collection = client.db().collection("Rick y Morty");
        const personaje = await collection.findOne({id:parseInt(req.params.id)});        
        if(personaje!=null){
             await collection.deleteOne({id:parseInt(req.params.id)});
            return res.status(200).json({
                message : "Ok"
            });
        }else{
            return res.status(404).json({
                message : "Not found"
            });  
        }
    })
    client.close();
};
export default {getStatus,getCharacters,getCharacterId,putSwichStatus,deleteCharacter}