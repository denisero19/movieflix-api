import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";

const port = 3000;
const app = express();
const prisma = new PrismaClient ();

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.get('/movies', async (_, res) => {
//     const movies = await prisma.movie.findMany({
//         orderBy: {
//           title: "asc",  
//         },
//         include: {
//             genres: true,
//             languages: true
//         },
//     });
   
//     res.json(movies);
// });

// app.post("/movies", async(req, res) => {

//     const { title, genre_id, language_id, oscar_count, release_date} = req.body;

//     try {

//         //case insensitive - se a busca for feita por john wick ou John wick ou JOHN WICK, o registro vai ser retornado na consulta

//         //case sensitive - sebuscar por john wick e no banco de dados estiver como John wick, não vai ser retornado na consulta

//         const movieWithSameTitle = await prisma.movie.findFirst({
//             where: { 
//                 title: { equals: title, mode: "insensitive"} 
//             },
//         });

//         if (movieWithSameTitle) {
//             res
//             .status (409)
//             .send({ message: "Já existe um filme cadastrado com esse título" });
//              return
//         }

//         await prisma.movie.create({
//             data: {
//                 title,
//                 genre_id,
//                 language_id,
//                 oscar_count,
//                 release_date: new Date(release_date),
//             },
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({message: "Falha ao cadastrar um filme"});
//         return
//     }
    
//     res.status(201).send();
//     return
// });

// app.put("/movies/:id", async (req, res) => {
//     //pegar o id do registro que vai ser atualizado
//     const id = Number(req.params.id);

//     try{
//     const movie = await prisma.movie.findUnique({
//         where: {
//             id
//         }
//     });

//     if(!movie){
//         res.status(404).send({ message: "Filme não encontrado" });
//         return
//     }

//     const data = { ...req.body };
//     data.release_date = data.release_date ? new Date(data.release_date) : undefined;
             
//     //pegar os dados do filme que será atualizado e atualizar ele no prisma
//     await prisma.movie.update({
//         where: {
//             id
//         },
//         data: data
//     });
// }catch(error){
//     console.error(error);
//     res.status(500).send ({ message: "Falha ao atualizar o registro do filme" });
//     return
// }

//     //retornar o status correto informando que o filme foi atualizado
//     res.status(200).send();
//     return
// });

// app.delete("/movies/:id", async (req, res) => {
//     const id = Number (req.params.id);

//     try {
//        const movie = await prisma.movie.findUnique({ where: { id }});

//         if (!movie) {
//             res. status(404).send({ message: "O filme não foi encontrado" });
//             return
//     }

//     await prisma.movie.delete({where: { id } });
// } catch (error) {
//     console.error(error);
//     res.status(500).send ({ message: "não foi possível remover o filme" });
//     return  
// }
//     res.status(200).send();
//     return
// });

// app.get("/movies/:genderName", async(req, res) => {
     
//     try {
//        const moviesFilteredByGenderName = await prisma.movie.findMany({
//         include: {
//             genres: true,
//             languages: true
//         },
//         where: {
//             genres: {
//                 name: {
//                     equals: req.params.genderName,
//                     mode: "insensitive"
//                 }
//             }
//         }
//     });
//       res.status(200).send(moviesFilteredByGenderName);
//       return

// } catch (error) {
//       console.error(error);
//       res.status(500).send({ message: "Falha ao filtrar filmes por gênero" });
//       return 
// }
  
// });

app.listen(port, () => {
    console.log(`Servidor em execução em http://localhost:${port}`);
});

// EXERCÍCIOS NODE.JS

//1 - Criando endpoint para atualizar informações de gênero//

// 1. Extrai o `id` da rota e o `name` do body da requisição.

// 2. Verifica se o `name` foi fornecido. Se não, retorna um erro 400 ao cliente informando que o nome é obrigatório.

// 3. Tenta encontrar um gênero com o id fornecido. Se o gênero não for encontrado, retorna um erro 404 ao cliente.

// 4. Verifica se já existe outro gênero com o mesmo nome (ignorando maiúsculas e minúsculas), excluindo o gênero que está sendo atualizado.Se um gênero com o mesmo nome já existir, retorna um erro 409 ao cliente.

// 5. Se não houver conflito, atualiza o gênero com o novo nome.

// 6. Se a atualização for bem-sucedida, retorna o gênero atualizado ao cliente com um status 200.

// 7. Se ocorrer um erro durante qualquer parte do processo, retorna um erro 500 ao cliente.

// app.put("/genres/:id", async (req, res) => {
//    const { id } = req.params;
//    const { name } = req.body;

//    if (!name) {
//     res.status(400).send({ message: "O nome do gênero é obrigatório." });
//     return
//    }

//    try {
//     const genre = await prisma.genre.findUnique({
//         where: { id: Number(id) },
//     });

//     if (!genre) {
//       res.status(404).send({ message: "Gênero não encontrado."});
//       return
//     }

//     const existingGenre = await prisma.genre.findFirst({
//         where: {
//             name: { equals: name, mode: "insensitive" },
//             id: { not: Number(id) }
//         },
//     });

//     if(existingGenre){
//         res.status(409).send({ message: "este nome de gênero já existe." });
//         return
//     };

//     const updateGenre = await prisma.genre.update({
//         where: { id:Number(id) },
//         data: { name },
//     });

//     res.status(200).json(updateGenre);
//     return

// } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: "Houve um problema ao atualizar o gênero" });
//     return
//    }
// });

//2 - Criando endpoint para adicionar novos gêneros //

// 1. Extrai `name` do body da requisição.

// 2. Verifica se o `name` foi fornecido. Se não, retorna um erro 400 ao cliente informando que o nome é obrigatório.

// 3. Tenta encontrar um gênero que já existe com o mesmo nome (ignorando maiúsculas e minúsculas).

// 4. Se um gênero com o mesmo nome já existir, retorna um erro 409 ao cliente informando que o gênero já existe.

// 5. Se o gênero não existir, tenta criar um novo gênereo no banco de dados.

// 6. Se a criação for bem-sucedida, retorna o gênero atualizado ao cliente com um status 201.

// 7. Se ocorrer um erro durante qualquer parte do processo, retorna um erro 500 ao cliente.

// app.post("/genres", async (req, res) => {
//     const { name } = req.body;
  
//     if(!name) {
//         res.status(400).send({ message: "O nome do gênero é obrigatório." });
//         return
//     }
  
//     try {
//         // Verificar se o gênero já existe (ignorando maiúsculas e minúsculas)
//         const existingGenre = await prisma.genre.findFirst({
//             where: { name: { equals: name, mode: "insensitive" } }
//         });
  
//         if (existingGenre) {
//             res.status(409).send({ message: "Esse gênero já existe." });
//             return
//         }
  
//         const newGenre = await prisma.genre.create({
//             data: {
//                 name
//             }
//         });
  
//         res.status(201).json(newGenre);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ message: "Houve um problema ao adicionar o novo gênero." });
//         return
//     }
// });

//3 - Criando endpoint para listar todos os gêneros//
   
// 1. Ele busca todos os gêneros na base de dados, ordenando-os pelo campo `name` em ordem ascendente.

// 2. Se a busca for bem-sucedida, ele retorna a lista de gêneros ao cliente.

// 3. Se ocorrer um erro durante a busca, retorna um erro 500 ao cliente.

// app.get("/genres", async (_, res) => {
//     try {
//        const genres = await prisma.genre.findMany({
//             orderBy: {
//                 name: "asc",
//             },
//         });
        
//         res.json(genres);
        
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ message: "Falha ao buscar os gêneros"});
//         return
//     }
// });

//4 - Criando endpoint para remover gêneros//

// 1. Extrai o `id` do body da requisição.

// 2. Tenta encontrar um gênero com o `id` fornecido.

// 3. Se o gênero não for encontrado, retorna um erro 404 ao cliente.

// 4. Se o gênero for encontrado, tenta deletar o gênero do banco de dados.

// 5. Se a remoção for bem-sucedida, retorna uma mensagem de sucesso ao cliente com um status 200.

// 6. Se ocorrer um erro durante qualquer parte deste processo, retorna um erro 500 ao cliente.

// app.delete("/genres/:id", async (req, res) => {
//     const { id } = req.params;

//     try {
//        const genre = await prisma.genre.findUnique({ where: { id: Number(id) }});

//         if (!genre) {
//             res. status(404).send({ message: "O gênero não foi encontrado" });
//             return
//     }

//     await prisma.genre.delete({where: { id: Number(id) }});

//     res.status(200).send({ message: "Gênero removido com sucesso"});
//     return

// } catch (error) {
//     console.error(error);
//     res.status(500).send ({ message: "não foi possível deletar o gênero" });
//     return  
// }
// });

//5 - Modificando o endpoint de listagem de filmes para incluir quantidade total e média de duração//

// 1 - No código abaixo, estamos buscando todos os filmes do banco de dados e em seguida, calculando a quantidade total de filmes e a média de duração.

// 2 - A quantidade total de filmes é simplesmente o número de filmes que foram retornados pela consulta.

// 3 - A média de duração é calculada somando a duração de todos os filmes e dividindo pelo total de filmes. Se não há filmes, definimos a média de duração como 0 para evitar divisão por zero.

// 4 - Por fim, retornamos um objeto com as informações que desejamos: `totalMovies`, `averageDuration` e a lista de `movies`.

// app.get("/movies", async (_, res) => {
//     try {
//        const movies = await prisma.movie.findMany({
//             orderBy: {
//                 title: "asc",
//             },

//             include: {
//                 genres: true,
//                 languages: true
//             }
//         });

//         const totalMovies = movies.length

//         let totalDuration = 0;
//         for(const movie of movies) {
//             totalDuration += movie.duration;
//         }

//         const averageDuration = totalMovies > 0 ? totalDuration / totalMovies : 0;
        
//         res.json({
//             totalMovies,
//             averageDuration,
//             movies,
//         });
        
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ message: "Falha ao buscar os filmes"});
//         return
//     }
// });

//6 - Modificando o endpoint de listagem de filmes para permitir ordenação por diversos critérios //

// 1. Primeiro, extrai o valor de `sort` da string de consulta. Este é o critério que os usuários desejam usar para ordenar os filmes.

// 2. Em seguida, define a cláusula `orderBy` com base no valor de `sort`. Se `sort` for "title", a ordenação será por título. Se `sort` for "release_date", a ordenação será por data de lançamento. Se `sort` for um valor não suportado ou não definido, a ordenação será mantida como indefinida, o que significa que o Prisma irá usar a ordenação padrão.

// 3. Depois, realiza a busca dos filmes no banco de dados usando o Prisma, passando a cláusula `orderBy` que acabamos de definir.

// 4. Por fim, retorna a lista de filmes ao cliente. Se ocorrer um erro durante qualquer parte deste processo, retorna um erro 500 ao cliente.

// app.get("/movies", async (req, res) => {
//       const sort  = req.query.sort;
//       console.log(sort);
      
//       let orderBy: Prisma.MovieOrderByWithRelationInput | Prisma.MovieOrderByWithRelationInput[] | undefined;;
//       if (sort === 'title') {
//         orderBy = { 
//             title: 'asc'
//         };

//       }else if (sort === 'release_date') {
//         orderBy = { 
//             release_date: 'asc'
//         };
//       }

//       try {
//           const movies = await prisma.movie.findMany({
//                 orderBy,
//                 include: {
//                     genres: true,
//                     languages: true,
//         },
//       });
  
//     res.json(movies);

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Falha ao buscar os filmes'});
//     }
//   });

 // 7 - Criando um filtro de language para o endpoint de listagem de filmes//

// 1. Primeiro, extrai o valor de `language` da string de consulta. Este é o idioma que os usuários desejam usar para filtrar os filmes.

// 2. Em seguida, define a cláusula `where` com base no valor de `language`. Se `language` for definido, a busca será realizada por filmes que possuem esse idioma. Caso contrário, `where` é mantido como indefinido, o que significa que todos os filmes serão retornados.

// 3. Depois, realiza a busca dos filmes no banco de dados usando o Prisma, passando a cláusula `where` que acabamos de definir.

// 4. Por fim, retorna a lista de filmes ao cliente. Se ocorrer um erro durante qualquer parte deste processo, retorna um erro 500 ao cliente.

// app.get("/movies", async (req, res) => {
//       const { language }  = req.query;
//       // const languageName = language as string;

//       try {
//         const movies = await prisma.movie.findMany({
//           where: {
//             language_id: { 
//               equals: Number(language)
//             }},

//           include: {
//               genres: true,
//               languages: true,
//   },
// });
//       res.json(movies);

//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Falha ao buscar os filmes'});
//       }
// });

//8 - Integração de funções de ordenação e filtro de idioma em um único endpoint.//

// Este endpoint permite que os usuários filtrem filmes por idioma e ordenem os resultados por título ou data de lançamento. Se nenhum desses parâmetros for fornecido, o endpoint retornará todos os filmes sem qualquer ordenação específica.

app.get("/movies", async (req, res) => {
  const { language, sort } = req.query;
  const languageName = language as string;
  const sortName = sort as string;

  let orderBy = undefined;

  if (sortName === "title") {
    orderBy = { title: Prisma.SortOrder.asc };
  } else if (sortName === "release_date") {
    orderBy = { release_date: Prisma.SortOrder.asc };
  }

  try {
    const movies = await prisma.movie.findMany({
      where: languageName
        ? {
            languages: {
              some: {
                name: {
                  equals: languageName,
                  mode: "insensitive",
                },
              },
            },
          }
        : undefined,
      orderBy,
      include: {
        genres: true,
        languages: true,
      },
    });

    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Falha ao buscar os filmes" });
  }
});