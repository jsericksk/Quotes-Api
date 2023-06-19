import { Knex } from "knex";
import { Table } from "../Table";
import { Quote } from "../../models/Quote";

export async function seed(knex: Knex) {
    const hasData = await knex(Table.quote).select().first();
    if (hasData) return;
    await knex(Table.quote).insert(quotes);
}

const quotes: Quote[] = [
    {
        id: 1,
        quote: "O maior erro que você pode cometer na vida é ter medo de cometer erros.",
        author: "Elbert Hubbard",
        postedByUsername: "John - Test",
        postedByUserId: 1,
        publicationDate: new Date()
    },
    {
        id: 2,
        quote: "Seja a mudança que você quer ver no mundo.",
        author: "Mahatma Gandhi",
        postedByUsername: "John - Test",
        postedByUserId: 1,
        publicationDate: new Date()
    },
    {
        id: 3,
        quote: "O sucesso é ir de fracasso em fracasso sem perder o entusiasmo.",
        author: "Winston Churchill",
        postedByUsername: "John - Test",
        postedByUserId: 1,
        publicationDate: new Date()
    },
    {
        id: 4,
        quote: "A felicidade não é algo pronto. Ela vem das suas próprias ações.",
        author: "Dalai Lama",
        postedByUsername: "John - Test",
        postedByUserId: 1,
        publicationDate: new Date()
    },
    {
        id: 5,
        quote: "A vida é 10% o que acontece comigo e 90% de como eu reajo a isso.",
        author: "Charles R. Swindoll",
        postedByUsername: "John - Test",
        postedByUserId: 1,
        publicationDate: new Date()
    },
    {
        id: 6,
        quote: "O único modo de fazer um excelente trabalho é amar aquilo que você faz.",
        author: "Steve Jobs",
        postedByUsername: "John - Test",
        postedByUserId: 1,
        publicationDate: new Date()
    },
    {
        id: 7,
        quote: "A imaginação é mais importante que o conhecimento.",
        author: "Albert Einstein",
        postedByUsername: "John - Test",
        postedByUserId: 1,
        publicationDate: new Date()
    },
    {
        id: 8,
        quote: "A educação é a arma mais poderosa que você pode usar para mudar o mundo.",
        author: "Nelson Mandela",
        postedByUsername: "Anna - Test",
        postedByUserId: 2,
        publicationDate: new Date()
    },
    {
        id: 9,
        quote: "O verdadeiro líder é aquele que sabe servir.",
        author: "Lao Tzu",
        postedByUsername: "Anna - Test",
        postedByUserId: 2,
        publicationDate: new Date()
    },
    {
        id: 10,
        quote: "A persistência é o caminho do êxito.",
        author: "Charles Chaplin",
        postedByUsername: "Anna - Test",
        postedByUserId: 2,
        publicationDate: new Date()
    },
    {
        id: 11,
        quote: "O maior tesouro que você pode ter é o conhecimento.",
        author: "Benjamin Franklin",
        postedByUsername: "Anna - Test",
        postedByUserId: 2,
        publicationDate: new Date()
    },
    {
        id: 12,
        quote: "A vida é o que acontece enquanto você está ocupado fazendo outros planos.",
        author: "John Lennon",
        postedByUsername: "Anna - Test",
        postedByUserId: 2,
        publicationDate: new Date()
    },
    {
        id: 13,
        quote: "A única maneira de fazer um bom trabalho é amar o que você faz.",
        author: "Steve Jobs",
        postedByUsername: "Anna - Test",
        postedByUserId: 2,
        publicationDate: new Date()
    },
    {
        id: 14,
        quote: "A simplicidade é o último grau de sofisticação.",
        author: "Leonardo da Vinci",
        postedByUsername: "Anna - Test",
        postedByUserId: 2,
        publicationDate: new Date()
    },
    {
        id: 15,
        quote: "A única pessoa que você está destinado a se tornar é a pessoa que você decide ser.",
        author: "Ralph Waldo Emerson",
        postedByUsername: "Anna - Test",
        postedByUserId: 2,
        publicationDate: new Date()
    },
    {
        id: 16,
        quote: "A vida é realmente simples, mas insistimos em torná-la complicada.",
        author: "Confúcio",
        postedByUsername: "Mary - Test",
        postedByUserId: 3,
        publicationDate: new Date()
    },
    {
        id: 17,
        quote: "A felicidade não é ter o que você quer, é querer o que você tem.",
        author: "Desconhecido",
        postedByUsername: "Mary - Test",
        postedByUserId: 3,
        publicationDate: new Date()
    },
    {
        id: 18,
        quote: "A melhor maneira de prever o futuro é criá-lo.",
        author: "Peter Drucker",
        postedByUsername: "Mary - Test",
        postedByUserId: 3,
        publicationDate: new Date()
    },
    {
        id: 19,
        quote: "A vida é como andar de bicicleta. Para manter o equilíbrio, você deve continuar se movendo.",
        author: "Albert Einstein",
        postedByUsername: "Mary - Test",
        postedByUserId: 3,
        publicationDate: new Date()
    },
    {
        id: 20,
        quote: "Acredite em si mesmo e todo o resto cairá no lugar.",
        author: "Walt Disney",
        postedByUsername: "Mary - Test",
        postedByUserId: 3,
        publicationDate: new Date()
    }
];