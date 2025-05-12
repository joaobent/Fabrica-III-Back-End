import pool from "../../../conexao.js";

export async function atualizaFrequencia(idfrequencia, clientes_idclientes, dataEntrada, dataSaida) {
    const conexao = await pool.getConnection();

    const query = `
        UPDATE frequencia 
        SET clientes_idclientes = ?, dataEntrada = ?, dataSaida = ?
        WHERE idfrequencia = ?
    `;

    const [resultado] = await conexao.execute(query, [clientes_idclientes, dataEntrada, dataSaida, idfrequencia]);
    conexao.release();
    return resultado;
}
