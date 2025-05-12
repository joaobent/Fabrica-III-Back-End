import pool from "../../../conexao.js";

async function executaQuery(conexao, query) {
	const [rows] = await conexao.execute(query);
	return rows;
}

export async function retornaClientes() {
	const conexao = await pool.getConnection();
	const query = `
		SELECT 
			clientes.idclientes,
			clientes.nome,
			clientes.senha,
			clientes.cpf,
			clientes.dataDeNascimento,
			clientes.email,
			clientes.telefone,
			clientes.contatoDeEmergencia,
			endereco.cep,
			endereco.numeroCasa,
			endereco.complemento,
			clientes.peso,
			clientes.altura,
			clientes.sexo,
			clientes.objetivo
		FROM clientes 
		INNER JOIN endereco ON clientes.endereco_idendereco = endereco.idendereco
		ORDER BY clientes.nome
	`;
	const resultado = await executaQuery(conexao, query);
	conexao.release();
	return resultado;
}

export async function retornaClientesPorNome(nome) {
	const conexao = await pool.getConnection();
	const query = `
		SELECT 
			clientes.nome,
			clientes.telefone,
			clientes.email
		FROM clientes 
		WHERE clientes.nome LIKE '%${nome}%'
	`;
	const resultado = await executaQuery(conexao, query);
	conexao.release();
	return resultado;
}
