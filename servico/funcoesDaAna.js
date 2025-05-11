import pool from "./conexao.js";

//Funcionários

// GET
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

// POST

export async function cadastrarFuncionario(dados) {
    const conexao = await pool.getConnection();
    console.log("Dados recebidos para cadastro:", dados);

    try {
        await conexao.beginTransaction();

        // 1. Inserir ENDEREÇO
        const [resultadoEndereco] = await conexao.execute(`
            INSERT INTO endereco (cep, numeroCasa, complemento)
            VALUES (?, ?, ?)
        `, [dados.endereco.cep, dados.endereco.numeroCasa, dados.endereco.complemento]);

        const enderecoId = resultadoEndereco.insertId;

        // 2. Inserir FORMAÇÃO
        const [resultadoFormacao] = await conexao.execute(`
            INSERT INTO formacao (formacao, certificado)
            VALUES (?, ?)
        `, [dados.formacao.formacao, dados.formacao.certificado]);

        const formacaoId = resultadoFormacao.insertId;

        // 3. Inserir FUNCIONÁRIO com os IDs acima
        const [resultadoFuncionario] = await conexao.execute(`
            INSERT INTO funcionarios (
                nome, senha, cpf, dataDeNascimento,
                email, email, fotoPerfil,
                endereco_idendereco, formacao_idformacao
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            dados.nome,
            dados.senha,
            dados.cpf,
            dados.dataDeNascimento,
            dados.email,
            dados.telefone,
            dados.fotoPerfil,
            enderecoId,
            formacaoId
        ]);

        await conexao.commit();
        return resultadoFuncionario;
    } catch (erro) {
        await conexao.rollback();
        throw erro;
    } finally {
        conexao.release();
    }
}


async function executaQuery(conexao, query) {
    const [rows] = await conexao.execute(query);
    return rows;
}