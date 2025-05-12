// Aqui serÃo colocadas todos os endpoints da API

import express from 'express';
// import pool from './servico/conexao.js';


const app = express();

app.use(express.json()); 

import routerFuncionario from './ana/rotas/funcionarios.js';
import routerFrequencia from './maria/rotas/frequencia.js';

app.use('/funcionarios', routerFuncionario)
app.use('/frequencia', routerFrequencia)


app.listen(9000, () => {
    const data = new Date();
    console.log("Servidor de funcionários rodando em: " + data);
});