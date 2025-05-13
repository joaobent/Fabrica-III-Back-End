import pool from '../../../conexao.js';

async function executarQuery(sql, params = []) {
    let conexao;
    try {
      conexao = await pool.getConnection();
      const [resultado] = await conexao.execute(sql, params);
      return resultado;
    } catch (error) {
      console.log(error)
    } finally {
      if (conexao) conexao.release();
    }
  }

async function editarMarca(id, nome) {
    try {
        id = parseInt(id, 10); // Garantindo que id seja um número inteiro
        const sql = "UPDATE marca SET nome = ? WHERE idmarca = ?";
        const resultado = await executarQuery(sql, [nome, id]);
        return resultado;
    } catch (error) {
        console.log(error)
    }
}

export { editarMarca }