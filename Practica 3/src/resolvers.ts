import { Request, Response, NextFunction } from 'express';
import { Db } from "mongodb";
import uuid4 from "uuid4";

const checkDateValidity = (
  day: string,
  month: string,
  year: string
): boolean => {
  const date = new Date(`${month} ${day}, ${year}`);
  return date.toString() !== "Invalid Date";
};

const status = async (req: Request, res: Response) => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  res.status(200).send(`${day}-${month}-${year}`);
};


const registrar = async( req:Request, res:Response, next:NextFunction)=>{
    let body = req.body
    const db:Db =req.app.get("db")   
    const collection = db.collection("Usuarios");   
    collection.insertOne(body)
    
        return res.status(200).json({
            message : "Registrado"
        });
   
};

const login = async( req:Request, res:Response, next:NextFunction)=>{
    let body = req.body
    const db:Db =req.app.get("db")   
    const collection = db.collection("Usuarios");
    var tokenAuth = uuid4()   
    const usuario = await collection.findOne({mail:req.body.mail, contraseña:req.body.contraseña});
    if(usuario?.token === null){
        await collection.updateOne({mail:req.body.mail, contraseña:req.body.contraseña},{$set:{token:tokenAuth}})
    }      
    return res.status(200).json({
        token: usuario?.token || tokenAuth
    });
        
};
const logout = async( req:Request, res:Response, next:NextFunction)=>{
    const db:Db =req.app.get("db")   
    var tokenAuth = uuid4()
    const collection = db.collection("Usuarios");
    const usuario = await collection.findOne({token:req.headers.token});
    if(usuario?.token !== null){
        await collection.updateOne({token:req.headers.token},{$set:{token:null}})
    }      
    return res.status(200).json({
        message : "Adios"           
    });
        
   
};
const freeSeats = async (req: Request, res: Response) => {
    const db: Db = req.app.get("db");
    const collection = db.collection("Asientos");
  
    if (!req.query) {
      return res.status(500).send("No params");
    }
  
    const { day, month, year } = req.query as {
      day: string;
      month: string;
      year: string;
    };
  
    if (!day || !month || !year) {
      return res.status(500).send("Missing day, month or year");
    }
  
    if (!checkDateValidity(day, month, year)) {
      return res.status(500).send("Invalid day, month or year");
    }
  
    const seats = await collection.find({ day, month, year }).toArray();
  
    const freeSeats = [];
    for (let i = 1; i <= 20; i++) {
      if (!seats.find((seat) => parseInt(seat.number) === i)) {
        freeSeats.push(i);
      }
    }
    return res.status(200).json({ free: freeSeats });
  };
  
const book = async (req: Request, res: Response) => {
    const date = new Date();
    const y = date.getFullYear();
    const db: Db = req.app.get("db");
    const collection = db.collection("Asientos");
    if (!req.query) {
      return res.status(500).send("No params");
    }
  
    const { day, month, year, number } = req.query as {
      day: string;
      month: string;
      year: string;
      number: string;
    };
  
    if (!day || !month || !year || !number) {
      return res.status(500).send("Missing day, month or year or seat number");
    }
  
    if (!checkDateValidity(day, month, year)) {
      return res.status(500).send("Invalid day, month or year");
    }
  
    const notFree = await collection.findOne({ day, month, year, number });
    if (notFree) {
      return res.status(500).send("Seat is not free");
    }
    const token =req.headers.token
    await collection.insertOne({ day, month, year, number,token });
  
    return res.status(200).json({ token });
  };
  
const free = async (req: Request, res: Response) => {
    const db: Db = req.app.get("db");
    const collection = db.collection("Asientos");
    if (!req.query) {
      return res.status(500).send("No params");
    }
  
    const { day, month, year } = req.query as {
      day: string;
      month: string;
      year: string;
    };
  
    const token = req.headers.token;
  
    if (!day || !month || !year || !token) {
      return res
        .status(500)
        .send("Missing day, month or year or seat number or token");
    }
  
    if (!checkDateValidity(day, month, year)) {
      return res.status(500).send("Invalid day, month or year");
    }
  
    const booked = await collection.findOne({ day, month, year, token });
    if (booked) {
      await collection.deleteOne({ day, month, year, token });
      return res.status(200).send("Seat is now free");
    }
  
    return res.status(500).send("Seat is not booked");
  };

const mybookings = async (req: Request, res: Response) => {
    const db: Db = req.app.get("db");
    const collection = db.collection("Asientos");
    const reservados = await collection.find({token:req.headers.token}).toArray();
    
    res.json(reservados)
};

export default {status,registrar,login,logout,freeSeats,free,book,mybookings}