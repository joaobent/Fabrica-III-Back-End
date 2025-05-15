import pool from '../../../conexao.js';

export async function deletarFormacao(id) {
  const conexao = await pool.getConnection();

  const query = `
    DELETE FROM formacao WHERE idformacao = ?
  `;

  const [resultado] = await conexao.execute(query, [id]);
  conexao.release();
  return resultado;
}
