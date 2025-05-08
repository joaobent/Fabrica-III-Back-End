// Aqui serão colocadas todas as funções para LISTAR(GET) as tabelas 



import pool from "./conexao.js";

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
            formacao.certificado AS nivelFormacao,
            enderecos.cep,
            enderecos.numeroCasa,
            enderecos.complemento
            
        FROM funcionarios 
        INNER JOIN formacao ON funcionarios.formacao_idformacao = formacao.idformacao
        INNER JOIN enderecos ON funcionarios.endereco_idendereco = enderecos.idendereco
        ORDER BY funcionarios.nome
    `;
    const resultado = await executaQuery(conexao, query);
    conexao.release();
    return resultado;
}

export async function retornaFuncionariosPorNome(nome) {
    const conexao = await pool.getConnection();
    const query = `
        SELECT 
            funcionarios.nome, funcionarios.telefone, funcionarios.email 
        FROM funcionarios 
        WHERE funcionarios.nome LIKE '%${nome}%'
    `;
    const resultado = await executaQuery(conexao, query);
    conexao.release();
    return resultado;
}



async function executaQuery(conexao, query) {
    const [rows] = await conexao.execute(query);
    return rows;
}
