import pool from "../../../conexao.js";


export async function executaQuery(conexao, query, params) {
  const [rows] = await conexao.execute(query, params);
  return rows;
}

export async function deletarFuncionarioPorId(id) {
  const conexao = await pool.getConnection();
  const query = `DELETE FROM funcionarios WHERE idfuncionarios = ?`;
  const [resultado] = await conexao.execute(query, [id]);
  conexao.release();
  return resultado;
}