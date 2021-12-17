import { gql } from "apollo-server";

export const typeDefs = gql `
type Ingredient{
    id: ID!
    name: String!
    recipes:[Recipe!]!
}

type Recipe{
    id: ID!
    name: String!
    description: String!
    ingredients: [Ingredient!]!
    author: User!
}

type User{
    id: ID!
    email: String!
    pwd: String!
    token: String
    recipes: [Recipe!]!
}

type Query{  
    getUsers:[User]!
    getRecipes:[Recipe]!
    getUser(email:String!):User
    getRecipe(id:ID!):Recipe
}

type Mutation{
    SignIn(email:String!, pwd:String!):String!
    SignOut(email:String!, pwd:String!):String!
    LogIn(email:String!, pwd:String!):String!
    LogOut(token:String!):String!
    AddIngredient(id:Int!,name:String!,token:String!):String!
    DeleteIngredient(id:Int!,name:String!,token:String!):String!
    AddRecipe(id:Int!,name:String!,description:String!,token:String!):String!
    UpdateRecipe(id:Int!,name:String!,description:String!,token:String!):String!
    DeleteRecipe(id:Int!,name:String!,description:String!,token:String!):String!    
}

`