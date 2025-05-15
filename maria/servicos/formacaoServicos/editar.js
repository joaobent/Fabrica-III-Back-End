import pool from "../../../conexao.js";

export async function atualizaFormacao(idformacao, formacao, certificado = null) {
    const conexao = await pool.getConnection();

    let query, valores;

    if (certificado) {
        query = `
            UPDATE formacao 
            SET formacao = ?, certificado = ?
            WHERE idformacao = ?
        `;
        valores = [formacao, certificado, idformacao];
    } else {
        query = `
            UPDATE formacao 
            SET formacao = ?
            WHERE idformacao = ?
        `;
        valores = [formacao, idformacao];
    }

    const [resultado] = await conexao.execute(query, valores);
    conexao.release();
    return resultado;
}
