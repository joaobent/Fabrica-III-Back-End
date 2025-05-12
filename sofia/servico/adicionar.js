import pool from "./conexao.js";

// Retorna todos os clientes
export async function retornaClientes() {
	const conexao = await pool.getConnection();
	const [resultado] = await conexao.execute(`
    SELECT * FROM clientes ORDER BY nome
  `);
	conexao.release();
	return resultado;
}

export async function retornaClientesPorNome(nome) {
	const conexao = await pool.getConnection();
	const [resultado] = await conexao.execute(
		`
    SELECT * FROM clientes WHERE nome LIKE ?
  `,
		[`%${nome}%`]
	);
	conexao.release();
	return resultado;
}

export async function adicionaCliente(cliente) {
	const conexao = await pool.getConnection();

	const query = `
    INSERT INTO clientes (
      nome, senha, cpf, dataDeNascimento, email,
      telefone, contatoDeEmergencia, endereco,
      peso, altura, sexo, objetivo
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

	const values = [
		cliente.nome,
		cliente.senha,
		cliente.cpf,
		cliente.dataDeNascimento,
		cliente.email,
		cliente.telefone,
		cliente.contatoDeEmergencia,
		cliente.endereco,
		cliente.peso,
		cliente.altura,
		cliente.sexo,
		cliente.objetivo,
	];

	try {
		const [resultado] = await conexao.execute(query, values);
		conexao.release();
		return resultado;
	} catch (erro) {
		conexao.release();
		throw erro;
	}
}
