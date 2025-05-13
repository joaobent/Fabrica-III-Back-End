import pool from '../../../conexao.js';

async function executarQuery(sql, params = []) {
    let conexao;
    try {
        conexao = await pool.getConnection();
        //console.log('Executando SQL:', sql, 'com params:', params); // DEBUG
        const [resultado] = await conexao.execute(sql, params);
        return resultado;
    } catch (error) {
        console.log(error)
    } finally {
        if (conexao) conexao.release();
    }
}

async function deletarMarca(id) {
    try {
        id = parseInt(id, 10); // Garantindo que id seja um número inteiro
        const sql = "DELETE FROM marca WHERE idmarca = ?";
        const resultado = await executarQuery(sql, [id]);
        return resultado;
    } catch (error) {
        console.log(error)
    }
}

export { deletarMarca }
