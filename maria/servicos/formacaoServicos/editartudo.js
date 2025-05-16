import pool from "../../../conexao.js";

export async function atualizarFormacaoParcial(idformacao, dadosAtualizados) {
  const campos = [];
  const valores = [];

  if (dadosAtualizados.formacao !== undefined) {
    campos.push('formacao = ?');
    valores.push(dadosAtualizados.formacao);
  }

  if (dadosAtualizados.certificado !== undefined) {
    campos.push('certificado = ?');
    valores.push(dadosAtualizados.certificado);
  }

  if (campos.length === 0) {
    return { affectedRows: 0 }; // Nada pra atualizar
  }

  valores.push(idformacao); // o id vai por último para o WHERE

  const conexao = await pool.getConnection();
  const query = `
    UPDATE formacao
    SET ${campos.join(', ')}
    WHERE idformacao = ?
  `;
  const [resultado] = await conexao.execute(query, valores);
  conexao.release();

  return resultado;
}
