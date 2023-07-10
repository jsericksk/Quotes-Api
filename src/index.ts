import { Knex } from "./database/knex/Knex";
import { server } from "./server";

const port = process.env.PORT || 3333;

const startServer = () => {
    server.listen(
        port, () => { console.log(`App running on port ${port}`); }
    );
};

if (process.env.IS_LOCALHOST !== "true") {
    Knex.migrate.latest().then(() => {
        startServer();
        /**Knex.seed.run()
            .then(() => startServer())
            .catch(console.log);*/
    }).catch(console.log);
} else {
    startServer();
}