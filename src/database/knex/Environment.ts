import { Knex } from "knex";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../../../.env") });

export const development: Knex.Config = {
    client: "pg",
    connection: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: Number(process.env.DATABASE_PORT || 5432),
    },
    migrations: {
        directory: path.resolve(__dirname, "..", "migrations"),
    },
    seeds: {
        directory: path.resolve(__dirname, "..", "seeds"),
    }
};

export const test: Knex.Config = {
    client: "sqlite3",
    useNullAsDefault: true,
    connection: ":memory:",
    migrations: {
        directory: path.resolve(__dirname, "..", "migrations"),
    },
    pool: {
        afterCreate: (connection: any, done: Function) => {
            connection.run("PRAGMA foreign_keys = ON");
            done();
        }
    },
};

export const production: Knex.Config = {
    client: "pg",
    connection: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: Number(process.env.DATABASE_PORT || 5432),
        ssl: { rejectUnauthorized: false },
    },
    migrations: {
        directory: path.resolve(__dirname, "..", "migrations"),
    },
    seeds: {
        directory: path.resolve(__dirname, "..", "seeds"),
    }
};