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

async function editarEquipamentos(id, nome) {
    try {
        id = parseInt(id, 10); // Garantindo que id seja um número inteiro
        const sql = "UPDATE equipamentos SET nome = ? WHERE idequipamentos = ?";
        const resultado = await executarQuery(sql, [nome, id]);
        return resultado;
    } catch (error) {
        console.log(error)
    }
}

async function editarEquipamentosParcial(id, campos) {
  const colunas = Object.keys(campos).map(campo => `${campo} = ?`).join(", ");
  const valores = Object.values(campos);
  const sql = `UPDATE equipamentos SET ${colunas} WHERE idequipamentos = ?`
  valores.push(id);
  return await executarQuery(sql, valores);
}

export { editarEquipamentos, editarEquipamentosParcial }