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

export async function buscarCertificadoPorId(id) {
  const [resultado] = await pool.execute('SELECT certificado FROM formacao WHERE idformacao = ?', [id]);
  return resultado[0];
}

export async function buscarFormacaoPorId(id) {
  const conexao = await pool.getConnection();

  const query = 'SELECT * FROM formacao WHERE idformacao = ?';

  const [rows] = await conexao.execute(query, [id]);
  conexao.release();
  return rows;
}
