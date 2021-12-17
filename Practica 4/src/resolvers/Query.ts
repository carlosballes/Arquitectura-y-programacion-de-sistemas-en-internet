import {Db, MongoClient} from "mongodb";
import { connectDB } from "../mongo";
export const Query = {
    getUsers: async()=>{
        const client = await connectDB();
        const db: Db = client;
        const collection = db.collection("Usuarios");
        const usuarios = await collection.find({}).toArray()
        return usuarios;
    },
    getRecipes: async()=>{
        const client = await connectDB();
        const db: Db = client;
        const collection = db.collection("Recetas");
        const recetas = await collection.find({}).toArray()
        return recetas;
    },
    getUser: async(parent: any, { email}: any)=>{
        const client = await connectDB();
        const db: Db = client;
        const collection = db.collection("Usuarios");
        const usuarios = await collection.findOne({email:email})
        return usuarios;
    },
    getRecipe: async(parent: any, { id}: any)=>{
        const client = await connectDB();
        const db: Db = client;
        const collection = db.collection("Recetas");
        const usuarios = await collection.findOne({id:id})
        return usuarios;
    },
  
}

export const Recipe ={
    ingredients:(parent:{ingredients:number[]}, args: any,{ingredients}:{ingredients:any}) =>{
        return parent.ingredients.map((ing, index) =>({
            name: ingredients[index],
            id:index
        }))
    }
}

export const Ingredient ={
    recipes:(parent:{id: number, name: String},args: any,{recipes, ingredients}:any)=>{
        return recipes.filter((r: { ingredients: number[]; }) => r.ingredients.some((i: number) => i === parent.id))
    }
}