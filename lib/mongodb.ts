import { MongoClient, Db } from "mongodb";

// Get the MongoDB connection string from .env.local
const uri = process.env.MONGODB_URI;

// Throw an error if the environment variable is missing
if (!uri) {
  throw new Error("MONGODB_URI is not defined in .env.local");
}

// Define a type for the global MongoDB cache
type GlobalMongo = {
  client?: MongoClient;
  promise?: Promise<MongoClient>;
};

// Extend the global object so the connection can be reused in development
declare global {
  var _mongo: GlobalMongo | undefined;
}

// Reuse the existing cache or create a new one
const globalMongo = global._mongo ?? (global._mongo = {});

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Create the connection only once
if (!globalMongo.promise) {
  client = new MongoClient(uri);
  globalMongo.promise = client.connect();
}

// Save the connection promise
// eslint-disable-next-line prefer-const
clientPromise = globalMongo.promise;

// Return the specific database used in this project
export async function connectDB(): Promise<Db> {
  const client = await clientPromise;
  return client.db("studentDB");
}