import pool from "../../../conexao.js";

export async function atualizarFormacaoParcial(idformacao, dados) {
  const campos = [];
  const valores = [];

  if (dados.formacao !== undefined) {
    campos.push('formacao = ?');
    valores.push(dados.formacao);
  }

  if (dados.certificado !== undefined) {
    campos.push('certificado = ?');
    valores.push(dados.certificado);
  }

  if (campos.length === 0) {
    return { affectedRows: 0 }; // Nada pra atualizar
  }

  const conexao = await pool.getConnection();
  const query = `
    UPDATE formacao
    SET ${campos.join(', ')}
    WHERE idformacao = ?
  `;

  valores.push(idformacao); // o id vai por último para o WHERE
  
  const [resultado] = await conexao.execute(query, valores);
  conexao.release();

  return resultado;
}
