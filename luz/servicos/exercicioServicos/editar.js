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

async function editarExercicio(id, dados) {
    try {
        id = parseInt(id, 10); // Garante que o ID seja um número inteiro

        const sql = `
            UPDATE exercicios SET
                quantDeSeries = ?,
                quantDeRepeticoes = ?,
                diaDaSemana = ?,
                parteDoCorpo = ?,
                clientes_idclientes = ?,
                funcionarios_idfuncionarios = ?,
                funcionarios_formacao_idformacao = ?,
                equipamentos_idequipamentos = ?,
                equipamentos_marca_idmarca = ?
            WHERE idexercicios = ?
        `;

        const parametros = [
            dados.quantDeSeries,
            dados.quantDeRepeticoes,
            dados.diaDaSemana,
            dados.parteDoCorpo,
            dados.clientes_idclientes,
            dados.funcionarios_idfuncionarios,
            dados.funcionarios_formacao_idformacao,
            dados.equipamentos_idequipamentos,
            dados.equipamentos_marca_idmarca,
            id
        ];

        const resultado = await executarQuery(sql, parametros);
        return resultado;
    } catch (error) {
        console.log(error);
    }
}


async function editarExercicioParcial(id, campos) {
  const colunas = Object.keys(campos).map(campo => `${campo} = ?`).join(", ");
  const valores = Object.values(campos);
  const sql = `UPDATE exercicios SET ${colunas} WHERE idexercicios = ?`
  valores.push(id);
  return await executarQuery(sql, valores);
}

export { editarExercicio, editarExercicioParcial }