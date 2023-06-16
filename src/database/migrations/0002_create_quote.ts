import { Knex } from "knex";
import { Table } from "../Table";

export async function up(knex: Knex) {
    return knex
        .schema
        .createTable(Table.Quotes, table => {
            table.bigIncrements("id").primary().index();
            table.string("quote").notNullable().checkLength(">=", 6);
            table.string("author").notNullable().checkLength(">=", 1);
            table.string("postedByUsername").notNullable();
            table
                .bigInteger("postedByUserId")
                .index()
                .notNullable()
                .references("id")
                .inTable(Table.Users)
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
            table.timestamp("publicationDate").defaultTo(knex.fn.now());
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