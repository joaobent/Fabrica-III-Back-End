import pool from "../../conexao.js";

async function executaQuery(conexao, query, params = []) {
	const [rows] = await conexao.execute(query, params);
	return rows;
}

export async function atualizarCliente(cliente) {
	const {
		idclientes,
		nome,
		senha,
		cpf,
		dataDeNascimento,
		email,
		telefone,
		contatoDeEmergencia,
		peso,
		altura,
		sexo,
		objetivo,
		endereco: {
			idendereco,
			cep,
			numeroCasa,
			complemento
		}
	} = cliente;

	const conexao = await pool.getConnection();
	try {
		await conexao.beginTransaction();

		const queryCliente = `
			UPDATE clientes SET
				nome = ?, senha = ?, cpf = ?, dataDeNascimento = ?, email = ?,
				telefone = ?, contatoDeEmergencia = ?, peso = ?, altura = ?,
				sexo = ?, objetivo = ?
			WHERE idclientes = ?
		`;

		const clienteParams = [
			nome, senha, cpf, dataDeNascimento, email,
			telefone, contatoDeEmergencia, peso, altura,
			sexo, objetivo, idclientes
		];

		await executaQuery(conexao, queryCliente, clienteParams);

		const queryEndereco = `
			UPDATE endereco SET
				cep = ?, numeroCasa = ?, complemento = ?
			WHERE idendereco = ?
		`;

		const enderecoParams = [cep, numeroCasa, complemento, idendereco];

		await executaQuery(conexao, queryEndereco, enderecoParams);

		await conexao.commit();
		return { sucesso: true };
	} catch (error) {
		await conexao.rollback();
		throw error;
	} finally {
		conexao.release();
	}
}