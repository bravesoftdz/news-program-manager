const express = require('express');
const router = express.Router();
const conexao = require('../conexao');

router.use(express.json()) // for parsing application/json
router.use(express.urlencoded({
    extended: true
}));


router.get('/', async (request, response) => { // usando await async
    try {
        const sql = `SELECT * FROM LOCAL`;

        console.log(sql);

        const results = await conexao.query(sql);
        response.status(200).json(results.rows);
    } catch (err) {
        response.status(404).send("Not found");
        console.log('Database ' + err);
    }
});

router.post('/', async (request, response) => {
    console.log(request.body.logradouro, request.body.numero_rua, request.body.cep, request.body.cidade, request.body.estado,
        request.body.bloco, request.body.andar, request.body.numero_sala);
    try {
        const sql = {
            text: 'INSERT INTO local ("logradouro", "numero_rua", "cep", "cidade", "estado", "bloco", "andar", "numero_sala") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            values: [request.body.logradouro, request.body.numero_rua, request.body.cep, request.body.cidade, request.body.estado,
                 request.body.bloco, request.body.andar, request.body.numero_sala]
        }

        console.log(sql);

        await conexao.query(sql); // insere pessoa

        response.status(200).send("Local inserido com sucesso");
    } catch (err) {
        response.status(400).send("Falha ao inserir local!\n" + err.message);
        console.log('Database ' + err);
        // console.log(Object.getOwnPropertyNames(err));
    }
});

router.delete('/:id', async (request, response) => {
    try {
        const sql = `DELETE FROM LOCAL L WHERE L.ID = ${request.params.id};`;

        console.log(sql);

        await conexao.query(sql); // insere pessoa

        response.status(200).send(`Local ${request.params.id} removido com sucesso`);
    } catch (err) {
        response.status(400).send("Falha ao remover Local!\n" + err.message);
        console.log('Database ' + err);
        // console.log(Object.getOwnPropertyNames(err));
    }
});


router.get('/cenarios_mais_utilizados', async (request, response) => { // usando await async
    try {
        const sql = `
            SELECT L.BLOCO, L.ANDAR, L.NUMERO_SALA, COUNT(*) AS QTDLOCACOES
            FROM VIDEO V
            JOIN LOCAL L
            ON L.ID = V.LOCAL
            WHERE L.BLOCO IS NOT NULL AND L.ANDAR IS NOT NULL AND L.NUMERO_SALA IS NOT NULL
            GROUP BY L.BLOCO, L.ANDAR, L.NUMERO_SALA
            ORDER BY QTDLOCACOES;
        `;

        console.log(sql);

        const results = await conexao.query(sql);
        response.status(200).json(results.rows);
    } catch (err) {
        response.status(404).send("Not found");
        console.log('Database ' + err);
    }
});

module.exports = router;
