import pool from "../../../conexao.js";

export async function atualizaFrequenciaParcial(idfrequencia, campos) {
  const conexao = await pool.getConnection();

  const chaves = [];
  const valores = [];

  if (campos.clientes_idclientes !== undefined) {
    chaves.push('clientes_idclientes = ?');
    valores.push(campos.clientes_idclientes);
  }

  if (campos.dataEntrada !== undefined) {
    chaves.push('dataEntrada = ?');
    valores.push(campos.dataEntrada);
  }

  if (campos.dataSaida !== undefined) {
    chaves.push('dataSaida = ?');
    valores.push(campos.dataSaida);
  }

  if (chaves.length === 0) {
    conexao.release();
    return { affectedRows: 0 }; // Nada a atualizar
  }

  const query = `UPDATE frequencia SET ${chaves.join(', ')} WHERE idfrequencia = ?`;
  valores.push(idfrequencia);

  const [resultado] = await conexao.execute(query, valores);
  conexao.release();
  return resultado;
}
