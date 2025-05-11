import pool from "./conexao.js";

//Funcionários

// GET


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
                email, fotoPerfil,
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