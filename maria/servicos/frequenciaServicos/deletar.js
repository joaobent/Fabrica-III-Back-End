// deleta_frequencia.js

export async function deletaFrequencia(idfrequencia) {
    const conexao = await pool.getConnection();

    const query = `
        DELETE FROM frequencia WHERE idfrequencia = ?
    `;

    const [resultado] = await conexao.execute(query, [idfrequencia]);
    conexao.release();
    return resultado.affectedRows > 0;
}