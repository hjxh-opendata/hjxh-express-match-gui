import {Db} from "mongodb";
import {DbName} from "./const";

const {MongoClient} = require("mongodb");


const user = "admin"
const pswd = "admin"
const auth_db_name = DbName.admin
const db_name = DbName.hjxh_express_match
const mongo_uri = "101.43.125.199:27017"

// Replace the uri string with your MongoDB deployment's connection string.
const uri =
    `mongodb://${user}:${pswd}@${mongo_uri}/?authSource=${auth_db_name}`


// Create a new MongoClient
export const client = new MongoClient(uri);
export const db = client.db(db_name) as Db

// Function to connect to the server
async function run() {
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        await db.command({ping: 1});
        console.log("Connected successfully to server");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}

run().catch(console.dir);

