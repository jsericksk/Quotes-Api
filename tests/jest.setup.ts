import supertest from "supertest";

import { server } from "../src/server";
import { Knex } from "../src/database/knex/Knex";

beforeAll(async () => {
    await Knex.migrate.latest();
});

afterAll(async () => {
    await Knex.destroy();
});

export const testServer = supertest(server);