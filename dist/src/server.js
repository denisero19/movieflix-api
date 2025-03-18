"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../swagger.json"));
const port = 3000;
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
app.get('/movies', async (_, res) => {
    const movies = await prisma.movie.findMany({
        orderBy: {
            title: "asc",
        },
        include: {
            genres: true,
            languages: true
        },
    });
    res.json(movies);
});
app.post("/movies", async (req, res) => {
    const { title, genre_id, language_id, oscar_count, release_date } = req.body;
    try {
        //case insensitive - se a busca for feita por john wick ou John wick ou JOHN WICK, o registro vai ser retornado na consulta
        //case sensitive - sebuscar por john wick e no banco de dados estiver como John wick, não vai ser retornado na consulta
        const movieWithSameTitle = await prisma.movie.findFirst({
            where: {
                title: { equals: title, mode: "insensitive" }
            },
        });
        if (movieWithSameTitle) {
            res
                .status(409)
                .send({ message: "Já existe um filme cadastrado com esse título" });
        }
        await prisma.movie.create({
            data: {
                title,
                genre_id,
                language_id,
                oscar_count,
                release_date: new Date(release_date),
            },
        });
    }
    catch (error) {
        res.status(500).send({ message: "Falha ao cadastrar um filme" });
    }
    res.status(201).send();
});
app.put("/movies/:id", async (req, res) => {
    //pegar o id do registro que vai ser atualizado
    const id = Number(req.params.id);
    try {
        const movie = await prisma.movie.findUnique({
            where: {
                id
            }
        });
        if (!movie) {
            res.status(404).send({ message: "Filme não encontrado" });
        }
        const data = { ...req.body };
        data.release_date = data.release_date ? new Date(data.release_date) : undefined;
        //pegar os dados do filme que será atualizado e atualizar ele no prisma
        await prisma.movie.update({
            where: {
                id
            },
            data: data
        });
    }
    catch (error) {
        res.status(500).send({ message: "Falha ao atualizar o registro do filme" });
    }
    //retornar o status correto informando que o filme foi atualizado
    res.status(200).send();
});
app.delete("/movies/:id", async (req, res) => {
    const id = Number(req.params.id);
    try {
        const movie = await prisma.movie.findUnique({ where: { id } });
        if (!movie) {
            res.status(404).send({ message: "O filme não foi encontrado" });
        }
        await prisma.movie.delete({ where: { id } });
    }
    catch (error) {
        res.status(500).send({ message: "não foi possível remover o filme" });
    }
    res.status(200).send();
});
app.get("/movies/:genderName", async (req, res) => {
    try {
        const moviesFilteredByGenderName = await prisma.movie.findMany({
            include: {
                genres: true,
                languages: true
            },
            where: {
                genres: {
                    name: {
                        equals: req.params.genderName,
                        mode: "insensitive"
                    }
                }
            }
        });
        res.status(200).send(moviesFilteredByGenderName);
    }
    catch (error) {
        res.status(500).send({ message: "Falha ao filtrar filmes por gênero" });
    }
});
app.listen(port, () => {
    console.log(`Servidor em execução em http://localhost:${port}`);
});
