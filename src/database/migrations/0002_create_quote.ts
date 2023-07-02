import { Knex } from "knex";
import { Table } from "../Table";
import { QuoteInputConstraint } from "../../commom/InputConstraints";

export async function up(knex: Knex) {
    return knex
        .schema
        .createTable(Table.quotes, table => {
            table.increments("id").primary().index();
            table.string("quote", QuoteInputConstraint.quote.max).index().notNullable().checkLength(">=", QuoteInputConstraint.quote.min);
            table.string("author", QuoteInputConstraint.author.max).notNullable().checkLength(">=", QuoteInputConstraint.author.min);
            table.string("postedByUsername").notNullable();
            table
                .integer("postedByUserId")
                .references("id")
                .inTable(Table.users)
                .onUpdate("CASCADE")
                .onDelete("CASCADE");
            table.timestamp("publicationDate").defaultTo(knex.fn.now());
        })
        .then(() => {
            console.log(`# Created table ${Table.quotes}`);
        });
}

export async function down(knex: Knex) {
    return knex
        .schema
        .dropTableIfExists(Table.quotes)
        .then(() => {
            console.log(`# Dropped table ${Table.quotes}`);
        });
}