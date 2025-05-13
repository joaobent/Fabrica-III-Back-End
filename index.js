// Aqui serÃo colocadas todos os endpoints da API

import express from 'express';
// import pool from './servico/conexao.js';

const app = express();

app.use(express.json()); 

import routerFuncionario from './ana/rotas/funcionarios.js';
import routerFrequencia from './maria/rotas/frequencia.js';
import routerFormacao from './maria/rotas/rotAformacao.js';
import routerMarca from './anne/rotas/marca.js';

app.use('/funcionarios', routerFuncionario)
app.use('/frequencia', routerFrequencia)
app.use('/formacao', routerFormacao)
app.use('/marca', routerMarca)


app.listen(9000, () => {
    const data = new Date();
    console.log("Servidor de funcionários rodando em: " + data);
});