import { Knex } from "./database/knex/Knex";
import { server } from "./server";

const port = process.env.PORT || 3000;

const startServer = () => {
    server.listen(
        port, () => { console.log(`App rodando na porta ${port}`); }
    );
};

if (process.env.IS_LOCALHOST !== "true") {
    Knex.migrate.latest().then(() => {
        Knex.seed.run()
            .then(() => startServer())
            .catch(console.log);
    });
} else {
    startServer();
}