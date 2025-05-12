import pool from '../../../conexao.js';

export async function adicionarFormacao(formacao, certificado) {
  const conexao = await pool.getConnection();

  const query = `INSERT INTO formacao (formacao, certificado) VALUES (?, ?)`;
  const [resultado] = await conexao.execute(query, [formacao, certificado]);

  conexao.release();
  return resultado.insertId;
}
