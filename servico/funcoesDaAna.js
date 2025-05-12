import pool from "./conexao.js";

//Funcionários

// GET


// POST



async function executaQuery(conexao, query) {
    const [rows] = await conexao.execute(query);
    return rows;
}