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

async function adicionarMarca(nome) {
    try{
        const sql = `INSERT INTO marca (nome) VALUE (?);`;
        return await executarQuery(sql, [nome]);
    } catch(error) {
        console.log(error)
    }
    
}

export { adicionarMarca }