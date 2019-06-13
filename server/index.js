const Joi = require('joi');
const genres = require('./routes/genres');
const pessoas = require('./routes/pessoas');
const pautas = require('./routes/pautas');
const equipamentos = require('./routes/equipamentos');
const materias = require('./routes/materias');
const local = require('./routes/local');
const express = require('express');
const app = express();
var path = require('path');

const bdSetup = require('./bdsetup');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/pessoas', pessoas);
app.use('/api/pautas', pautas);
app.use('/api/equipamentos', equipamentos);
app.use('/api/materias', materias);
app.use('/api/local', local);

// BD SETUP -> DROP E CREATE TABLES
async function bd_setup() {
    await bdSetup.drop();
    await bdSetup.create();
    await bdSetup.populate();
}
//bd_setup(); // drop e create

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Listening on port ${port}...`));