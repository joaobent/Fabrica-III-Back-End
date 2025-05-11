// Aqui serão colocadas todas as funções para CADASTRAR(POST) as tabelas 

import pool from "./conexao.js";

export async function cadastraFrequencia(dataEntrada, dataSaida, clientes_idclientes) {
    const conexao = await pool.getConnection();

    const query = `
        INSERT INTO frequencia (dataEntrada, dataSaida, clientes_idclientes)
        VALUES (?, ?, ?)
    `;

    const [resultado] = await conexao.execute(query, [dataEntrada, dataSaida, clientes_idclientes]);
    conexao.release();
    return resultado.insertId;
}