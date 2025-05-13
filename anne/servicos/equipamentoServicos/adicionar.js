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

async function adicionarEquipamentos(nome, tipo, numeroDIncricao, descricao, marca_idmarca) {
    try{
        const sql = `INSERT INTO equipamentos (nome, tipo, numeroDIncricao, descricao, marca_idmarca) VALUE (?, ?, ?, ?, ?);`;
        return await executarQuery(sql, [nome, tipo, numeroDIncricao, descricao, marca_idmarca]);
    } catch(error) {
        console.log(error)
    }
    
}

export { adicionarEquipamentos }