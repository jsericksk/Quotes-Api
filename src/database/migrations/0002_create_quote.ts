import { Knex } from "knex";
import { Table } from "../Tables";

export async function up(knex: Knex) {
    return knex
        .schema
        .createTable(Table.Quotes, table => {
            table.bigIncrements("id").primary().index();
            table.string("quote").notNullable().unique().checkLength(">=", 6);
            table.string("author").notNullable().checkLength(">=", 3);
            table.jsonb("postedBy").notNullable();
            table.date("publicationDate").notNullable();
        })
        .then(() => {
            console.log(`# Created table ${Table.Quotes}`);
        });
}

export async function down(knex: Knex) {
    return knex
        .schema
        .dropTable(Table.Quotes)
        .then(() => {
            console.log(`# Dropped table ${Table.Quotes}`);
        });
}