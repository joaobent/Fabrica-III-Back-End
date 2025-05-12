import pool from "../../conexao.js";

export async function cadastraFrequencia(clientes_idclientes, dataEntrada, dataSaida) {
    const conexao = await pool.getConnection();

    const query = `
        INSERT INTO frequencia (clientes_idclientes, dataEntrada, dataSaida)
        VALUES (?, ?, ?)
    `;

    const [resultado] = await conexao.execute(query, [ clientes_idclientes, dataEntrada, dataSaida]);
    conexao.release();
    return resultado.insertId;
}