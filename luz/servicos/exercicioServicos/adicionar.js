import pool from "../../../conexao.js"

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

async function adicionarExercicio(quantDeSeries, quantDeRepeticoes, diaDaSemana, parteDoCorpo, clientes_idclientes, funcionarios_idfuncionarios, funcionarios_formacao_idformacao, equipamentos_idequipamentos, equipamentos_marca_idmarca) {
    try {
        const sql = `INSERT INTO exercicios (quantDeSeries, quantDeRepeticoes, diaDaSemana, parteDoCorpo, clientes_idclientes, funcionarios_idfuncionarios,funcionarios_formacao_idformacao, equipamentos_idequipamentos, equipamentos_marca_idmarca) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        return await executarQuery(sql, [quantDeSeries, quantDeRepeticoes, diaDaSemana, parteDoCorpo, clientes_idclientes, funcionarios_idfuncionarios, funcionarios_formacao_idformacao, equipamentos_idequipamentos, equipamentos_marca_idmarca]);
    } catch (error) {
        console.log(error)
    }

}

export { adicionarExercicio }