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

async function apresentarMarca() {
  const sql = `SELECT * FROM marca`;
  try {
    const resultado = await executarQuery(sql);
    return resultado;
  } catch (error) {
    console.log(error)
  }
}

async function apresentarMarcaPorId(id) {

  const sql = `SELECT * FROM marca WHERE idmarca = ?`;
  try {
    const resultado = await executarQuery(sql, [id]);

    return resultado;
  } catch (error) {
    console.log(error)
  }
}

async function apresentarMarcaPorNome(nome) {

  const sql = `SELECT * FROM marca WHERE nome LIKE ?`;
  try {
    const resultado = await executarQuery(sql, [`%${nome}%`]);

    return resultado;
  } catch (error) {
    console.log(error)
  }
}

export { apresentarMarca, apresentarMarcaPorId, apresentarMarcaPorNome };
