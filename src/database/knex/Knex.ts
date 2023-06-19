import "dotenv/config";
import knex from "knex";
import pg from "pg";
import { development, production, test } from "./Environment";

function fixReturnOfBigIntTypesInPostgres() {
    pg.types.setTypeParser(20, "text", parseInt);
}
fixReturnOfBigIntTypesInPostgres();

const getEnvironment = () => {
    switch (process.env.NODE_ENV) {
        case "production": return production;
        case "test": return test;

        default: return development;
    }
};

export const Knex = knex(getEnvironment());