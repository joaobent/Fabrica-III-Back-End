import pool from '../../../conexao.js';

export async function buscarFormacao() {
  const conexao = await pool.getConnection();

  const query = `
    SELECT idformacao, formacao
    FROM formacao
  `;

  const [resultado] = await conexao.execute(query);
  conexao.release();
  return resultado;
}
