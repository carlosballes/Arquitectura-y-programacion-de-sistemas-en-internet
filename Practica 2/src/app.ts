import { getCharacters } from "./rickmortyapi";
import { Character } from "./types";
import { connectMongo } from "./mongo/mongoconnect";
import axios, { Axios } from "axios";
import { connect } from "http2";
import { Collection,MongoClient } from "mongodb";


const run = async () => {
  const conn = await connectMongo("mongodb+srv://Carlos:pipo@cluster0.ueeyw.mongodb.net/Carlos?retryWrites=true&w=majority");
  console.log("Me he conectado a mongo");
  const collection = conn.db().collection("Rick y Morty");
  collection.drop();
  let next: string = "https://rickandmortyapi.com/api/character";
  while (next) {
    const data: { next: string; characters: Character[] } = await getCharacters(
      next
    );
    const characters = data.characters.map((char) => {
      const { id, name, status, species, episode } = char;
      return {
        id,
        name,
        status,
        species,
        episode,
      };
    });
    await collection.insertMany(characters);

    // ADD CHARACTERS HERE TO THE DATABASE, AND GO FOR THE NEXT PAGE
    next = data.next;
    console.log(next);
  }
  await conn.close();
};

try {
  run();
} catch (e) {
  console.error(e);
}