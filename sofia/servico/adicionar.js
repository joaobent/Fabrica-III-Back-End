import pool from "../../conexao.js";

export async function cadastrarCliente(dados) {
	const conexao = await pool.getConnection();
	console.log("Dados recebidos para cadastro:", dados);

	try {
		await conexao.beginTransaction();

		// Validação básica
		if (!dados?.endereco?.cep || !dados.nome || !dados.cpf) {
			throw new Error("Dados obrigatórios ausentes.");
		}

		const [resultadoEndereco] = await conexao.execute(
			`INSERT INTO endereco (cep, numeroCasa, complemento)
			 VALUES (?, ?, ?)`,
			[
				dados.endereco.cep,
				dados.endereco.numeroCasa,
				dados.endereco.complemento
			]
		);

		const enderecoId = resultadoEndereco.insertId;

		const [resultadoCliente] = await conexao.execute(
			`INSERT INTO clientes (
				nome, cpf, dataDeNascimento,
				email, telefone, contatoDeEmergencia,
				peso, altura, sexo,
				objetivo, fotoPerfil, endereco_idendereco
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
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
			]
		);

		await conexao.commit();
		console.log("Cliente cadastrado com sucesso.");
		return resultadoCliente;
	} catch (erro) {
		await conexao.rollback();
		console.error("Erro ao cadastrar cliente:", erro);
		throw erro;
	} finally {
		conexao.release();
	}
}