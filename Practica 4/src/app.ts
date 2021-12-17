import { ApolloError, ApolloServer, gql } from "apollo-server";
import {Db, MongoClient} from "mongodb";
import { connectDB } from "./mongo";
import { typeDefs } from "./schema";
import {Query} from "./resolvers/Query"
import {Mutation} from "./resolvers/Mutation"
import {Recipe} from "./resolvers/Query"
import {Ingredient} from "./resolvers/Query"

const resolvers ={
    Query,
    Mutation,
    Recipe,
    Ingredient
}

const run = async () =>{
    const client = await connectDB();
    const server = new ApolloServer({typeDefs, resolvers});
    server.listen(8000).then(()=>{
    console.log("Server escuchando en el puerto 8000")
})}
try{
    run();
}catch(e){
    console.error(e);
}