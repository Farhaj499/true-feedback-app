import { AnyARecord } from "dns";
import mongoose from "mongoose";

type ConnectionObject = {
    isConnected? : number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("Already connected database");
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI || "")
        connection.isConnected = db.connections[0].readyState
        console.log("MongoDB Connected successfully");

    } catch (error: any) {
        console.log("Database connection failed", error);
        process.exit(1)
    }
} 

export default dbConnect;
