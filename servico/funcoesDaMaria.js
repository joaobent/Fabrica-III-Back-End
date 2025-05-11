//Frequência

import pool from "./conexao.js";

import {retornaFrequencias,
    retornaFrequenciasPorClienteId, cadastraFrequencia} from "./servico/cadastra_servico.js"


// retorna_frequencia.js

export async function retornaFrequencias() {
    const conexao = await pool.getConnection();

    const query = `
        SELECT 
            idfrequencia,
            dataEntrada,
            dataSaida,
            clientes_idclientes
        FROM frequencia
        ORDER BY dataEntrada DESC
    `;

    const [rows] = await conexao.execute(query);
    conexao.release();
    return rows;
}

export async function retornaFrequenciasPorClienteId(idCliente) {
    const conexao = await pool.getConnection();

    const query = `
        SELECT 
            idfrequencia,
            dataEntrada,
            dataSaida,
            clientes_idclientes
        FROM frequencia
        WHERE clientes_idclientes = ?
        ORDER BY dataEntrada DESC
    `;

    const [rows] = await conexao.execute(query, [idCliente]);
    conexao.release();
    return rows;
}

//atualiza frequencia

export async function atualizaFrequencia(idfrequencia, novosDados) {
    const conexao = await pool.getConnection();

    const query = `
        UPDATE frequencia
        SET dataEntrada = ?, dataSaida = ?, clientes_idclientes = ?
        WHERE idfrequencia = ?
    `;

    const { dataEntrada, dataSaida, clientes_idclientes } = novosDados;

    const [resultado] = await conexao.execute(query, [
        dataEntrada,
        dataSaida,
        clientes_idclientes,
        idfrequencia
    ]);

    conexao.release();
    return resultado;
}

// Exemplo de uso:
// await atualizaFrequenciaParcial(3, { dataSaida: '2025-05-12 16:00:00' });


// cadastra_frequencia.js

export async function cadastraFrequencia(clientes_idclientes, dataEntrada, dataSaida, idfrequencia) {
    const conexao = await pool.getConnection();

    const query = `
        INSERT INTO frequencia (clientes_idclientes, dataEntrada, dataSaida, idfrequencia)
        VALUES (?, ?, ?)
    `;

    const [resultado] = await conexao.execute(query, [clientes_idclientes, dataEntrada, dataSaida , idfrequencia]);
    conexao.release();
    return resultado.insertId;
}

// deleta_frequencia.js

export async function deletaFrequencia(idfrequencia) {
    const conexao = await pool.getConnection();

    const query = `
        DELETE FROM frequencia WHERE idfrequencia = ?
    `;

    const [resultado] = await conexao.execute(query, [idfrequencia]);
    conexao.release();
    return resultado.affectedRows > 0;
}