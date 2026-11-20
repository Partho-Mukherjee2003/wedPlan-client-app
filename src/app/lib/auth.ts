import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is not set.");
}

// MongoClient global cache e rakho — Vercel serverless e ek-i
// client reuse hobe, "Topology is closed" error asbe na
const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient;
};

const client = globalForMongo.mongoClient ?? new MongoClient(mongoUri);
globalForMongo.mongoClient = client;

const db = client.db("WedPlan");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || process.env.CLIENT_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  user: {
    additionalFields: {
      role: {
        type: ["customer", "vendor"],
        required: false,
        defaultValue: "customer",
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [jwt()],
});
