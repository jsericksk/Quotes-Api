import { Knex } from "knex";
import { Table } from "../Table";

export async function up(knex: Knex) {
    return knex
        .schema
        .createTable(Table.quote, table => {
            table.bigIncrements("id").primary().index();
            table.string("quote").notNullable().checkLength(">=", 6);
            table.string("author").notNullable().checkLength(">=", 1);
            table.string("postedByUsername").notNullable();
            table
                .bigInteger("postedByUserId")
                .unsigned()
                .references("id")
                .inTable(Table.user)
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
            table.timestamp("publicationDate").defaultTo(knex.fn.now());
        })
        .then(() => {
            console.log(`# Created table ${Table.quote}`);
        });
}

export async function down(knex: Knex) {
    return knex
        .schema
        .dropTable(Table.quote)
        .then(() => {
            console.log(`# Dropped table ${Table.quote}`);
        });
}