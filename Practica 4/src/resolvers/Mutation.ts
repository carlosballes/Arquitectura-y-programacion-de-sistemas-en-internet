import { Db, MongoClient } from "mongodb";
import { connectDB } from "../mongo";
import { token } from "morgan";
import uuid4 from "uuid4";

export const Mutation = {
    SignIn: async (parent: any, { email, pwd }: any) => {
        const client = await connectDB();
        const db: Db = client;
        const collection = db.collection("Usuarios");
        const user = await collection.findOne({ email: email })
        if (user) {
            return "Ya existe un usuario con este correo"
        } else {
            await collection.insertOne({ email: email, pwd: pwd, token: "" })
            return "Añadido"
        }
    },

    SignOut: async (parent: any, { email, pwd }: any) => {
        const client = await connectDB();
        const db: Db = client;
        const collection = db.collection("Usuarios");
        const user = await collection.findOne({ email: email })

        if (user) {
            if (user.token !== "") {
                if (user.pwd === pwd) {
                    await collection.deleteOne({ email: email })
                    return "Borrado"
                } else {
                    return "Contraseña incorrecta"
                }
            } else {
                return "No loggeado"
            }

        } else {
            return "Este usuario no existe"
        }
    },

    LogIn: async (parent: any, { email, pwd }: any) => {
        const client = await connectDB();
        const db: Db = client;
        let tokenAuth = uuid4()
        const collection = db.collection("Usuarios");
        const user = await collection.findOne({ email: email, pwd: pwd })
        if (user) {
            await collection.updateOne({ email: email, pwd: pwd }, { $set: { token: tokenAuth } })
            return user.token || tokenAuth
        } else {
            return "Datos erroneos"
        }
    },

    LogOut: async (parent: any, { token }: any) => {
        const client = await connectDB();
        const db: Db = client;
        const collection = db.collection("Usuarios");
        const user = await collection.findOne({ token: token })
        if (user) {
            await collection.updateOne({ token:token }, { $set: { token: "" } })
            return "Sesion cerrada"
        } else {
            return "Datos erroneos"
        }
    },

    AddIngredient: async (parent: any, { id, name, token }: any) => {
        const client = await connectDB();
        const db: Db = client;

        const compro = db.collection("Usuarios");
        const user = await compro.findOne({ token: token })
        if (user?.token !== "") {
            const collection = db.collection("Ingredientes");
            const ingre = await collection.findOne({ id, name: name })
            if (ingre) {
                return "Ya existe el ingrediente"
            } else {
                await collection.insertOne({ id: id, name: name })
                return "Añadido"
            }
        } else {
            return "Usuario no registrado"
        }
    },

    DeleteIngredient: async (parent: any, { id, name, token }: any) => {
        const client = await connectDB();
        const db: Db = client;

        const compro = db.collection("Usuarios");
        const user = await compro.findOne({ token: token })
        if (user?.token !== "") {
            const collection = db.collection("Ingredientes");
            const ingre = await collection.findOne({ id, name: name })
            if (ingre) {
                await collection.deleteOne({ id: id, name: name })
                return "Borrado"               
            } else {
                return "No existe el ingrediente"
            }
        } else {
            return "Usuario no registrado"
        }
    },

    AddRecipe: async (parent: any, { id, name,description, token }: any) => {
        const client = await connectDB();
        const db: Db = client;

        const compro = db.collection("Usuarios");
        const user = await compro.findOne({ token: token })
        if (user?.token !== "") {
            const collection = db.collection("Recetas");
            const ingre = await collection.findOne({ id:id, name: name })
            if (ingre) {
                return "Ya exista receta"
            } else {
                await collection.insertOne({ id: id, name: name,description: description })
                return "Añadida"
            }
        } else {
            return "Usuario no registrado"
        }
    },

    UpdateRecipe: async (parent: any, { id, name,description, token }: any) => {
        const client = await connectDB();
        const db: Db = client;

        const compro = db.collection("Usuarios");
        const user = await compro.findOne({ token: token })
        if (user?.token !== "") {
            const collection = db.collection("Recetas");
            const ingre = await collection.findOne({ id:id, name: name })
            if (ingre) {
                await collection.updateOne({ id: id, name: name,description: description},{$set:{description:description}})
                return "receta actualizada"
            } else {
                return "La receta no existe"
            }
        } else {
            return "Usuario no registrado"
        }
    },

    DeleteRecipe: async (parent: any, { id, name,description, token }: any) => {
        const client = await connectDB();
        const db: Db = client;

        const compro = db.collection("Usuarios");
        const user = await compro.findOne({ token: token })
        if (user?.token !== "") {
            const collection = db.collection("Recetas");
            const ingre = await collection.findOne({ id:id, name: name })
            if (ingre) {
                await collection.deleteOne({ id: id, name: name,description: description })
                return "Receta borrada"
            } else {
                return "No existe la receta"
            }
        } else {
            return "Usuario no registrado"
        }
    },


}