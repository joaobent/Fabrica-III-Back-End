// Aqui serão colocadas todas as funções para LISTAR(GET) as tabelas 

import pool from "./conexao.js";

//Funcionários

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
            endereco.cep,
            endereco.numeroCasa,
            endereco.complemento   
        FROM funcionarios 
        INNER JOIN formacao ON funcionarios.formacao_idformacao = formacao.idformacao
        INNER JOIN endereco ON funcionarios.endereco_idendereco = endereco.idendereco
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


// frequencia

export async function retornaFrequencias() {
    const conexao = await pool.getConnection();

    const query = `
        SELECT 
            idfrequencia,
            dataEntrada,
            dataSaida,
            clientes_idclientes
        FROM frequencia
        ORDER BY dataEntrada DESC
    `;

    const [rows] = await conexao.execute(query);
    conexao.release();
    return rows;
}

export async function retornaFrequenciasPorClienteId(idCliente) {
    const conexao = await pool.getConnection();

    const query = `
        SELECT 
            idfrequencia,
            dataEntrada,
            dataSaida,
            clientes_idclientes
        FROM frequencia
        WHERE clientes_idclientes = ?
        ORDER BY dataEntrada DESC
    `;

    const [rows] = await conexao.execute(query, [idCliente]);
    conexao.release();
    return rows;
}
