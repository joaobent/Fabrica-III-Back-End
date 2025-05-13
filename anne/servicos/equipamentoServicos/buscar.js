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

async function apresentarEquipamentos() {
  const sql = `SELECT * FROM equipamentos`;
  try {
    const resultado = await executarQuery(sql);
    return resultado;
  } catch (error) {
    console.log(error)
  }
}

async function apresentarEquipamentosPorId(id) {

  const sql = `SELECT * FROM equipamentos WHERE idequipamentos = ?`;
  try {
    const resultado = await executarQuery(sql, [id]);

    return resultado;
  } catch (error) {
    console.log(error)
  }
}

async function apresentarEquipamentosPorIdMarca(idmarca) {

  const sql = `SELECT * FROM equipamentos WHERE marca_idmarca = ?`;
  try {
    const resultado = await executarQuery(sql, [idmarca]);

    return resultado;
  } catch (error) {
    console.log(error)
  }
}

async function apresentarEquipamentosPorNome(nome) {

  const sql = `SELECT * FROM equipamentos WHERE nome LIKE ?`;
  try {
    const resultado = await executarQuery(sql, [`%${nome}%`]);

    return resultado;
  } catch (error) {
    console.log(error)
  }
}

export { apresentarEquipamentos, apresentarEquipamentosPorId, apresentarEquipamentosPorNome, apresentarEquipamentosPorIdMarca };
