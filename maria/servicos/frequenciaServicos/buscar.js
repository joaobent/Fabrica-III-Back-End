import pool from "../../../conexao.js";

// Frequencia

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
