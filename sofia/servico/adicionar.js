import pool from "../../../conexao.js";


export async function cadastrarCliente(dados) {
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

        // 3. Inserir FUNCIONÁRIO com os IDs acima
        const [resultadoCliente] = await conexao.execute(`
            INSERT INTO clientes (
                nome, cpf, dataDeNascimento,
                email, telefone, email, telefone, contatoDeEmergencia,
				cep, numeroCasa, complemento, peso, altura,sexo,
				objetivo, fotoPerfil,
                endereco_idendereco
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            dados.nome,
            dados.cpf,
            dados.dataDeNascimento,
            dados.email,
            dados.telefone,
			dados.contatoDeEmergencia,
			dados.peso,
			dados.altura,
			dados.sexo,
			dados.objetivo,
            dados.fotoPerfil,
            enderecoId
        ]);

        await conexao.commit();
        return resultadoCliente;
    } catch (erro) {
        await conexao.rollback();
        throw erro;
    } finally {
        conexao.release();
    }
}
