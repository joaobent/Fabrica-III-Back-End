import pool from "../../../conexao.js";

export async function executaQuery(conexao, query, params) {
  const [rows] = await conexao.execute(query, params);
  return rows;
}

export async function retornaFuncionarios() {
    const conexao = await pool.getConnection();
    const query = `
        SELECT 
            funcionarios.idfuncionarios,
            funcionarios.nome,
            funcionarios.senha,
            funcionarios.cpf,
            funcionarios.dataDeNascimento,
            funcionarios.email,
            funcionarios.telefone,
            formacao.formacao AS nomeFormacao,
            endereco.cep,
            endereco.numeroCasa,
            endereco.complemento   
        FROM funcionarios 
        INNER JOIN formacao ON funcionarios.formacao_idformacao = formacao.idformacao
        INNER JOIN endereco ON funcionarios.endereco_idendereco = endereco.idendereco
        ORDER BY funcionarios.idfuncionarios
    `;
    const resultado = await executaQuery(conexao, query);
    conexao.release();
    return resultado;
}

export async function retornaFuncionariosPorNome(nome) {
    const conexao = await pool.getConnection();
    const query = `
        SELECT 
            funcionarios.nome, 
            funcionarios.telefone, 
            funcionarios.email,
            funcionarios.cpf,
            funcionarios.dataDeNascimento,
            formacao.formacao AS nomeFormacao
        FROM funcionarios 
        INNER JOIN formacao ON funcionarios.formacao_idformacao = formacao.idformacao
        WHERE funcionarios.nome LIKE ?
    `;
    const resultado = await executaQuery(conexao, query,[`%${nome}%`]);
    conexao.release();
    return resultado;
}

export async function retornaFuncionarioPorid(id) {
    const conexao = await pool.getConnection();
    const query = `
        SELECT 
        funcionarios.idfuncionarios, funcionarios.nome, funcionarios.telefone, funcionarios.email 
        FROM funcionarios 
        WHERE funcionarios.idfuncionarios = ${id};
    `;
    const resultado = await executaQuery(conexao, query);
    conexao.release();
    return resultado;
}


