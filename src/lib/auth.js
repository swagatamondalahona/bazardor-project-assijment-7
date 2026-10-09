
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.BETTER_AUTH_MONGODB_URI;

if (!uri) {
    throw new Error(
        "BETTER_AUTH_MONGODB_URI is missing. Check your .env.local file."
    );
}

const client = new MongoClient(uri);

const database = client.db("bazardor");

const socialProviders = {};

if (
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET
) {
    socialProviders.google = {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    };
}

if (
    process.env.GITHUB_CLIENT_ID &&
    process.env.GITHUB_CLIENT_SECRET
) {
    socialProviders.github = {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
    };
}

export const auth = betterAuth({
    database: mongodbAdapter(database, {
        client,
    }),

    emailAndPassword: {
        enabled: true,
    },

    socialProviders,
});

