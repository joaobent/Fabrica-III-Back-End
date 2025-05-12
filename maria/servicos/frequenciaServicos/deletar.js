// deleta_frequencia.js

import pool from '../../../conexao.js';

export async function deletarFrequencia(id) {
  const conexao = await pool.getConnection();

  const query = `
    DELETE FROM frequencia WHERE idfrequencia = ?
  `;

  const [resultado] = await conexao.execute(query, [id]);
  conexao.release();
  return resultado;
}
