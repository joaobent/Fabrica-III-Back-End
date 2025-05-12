import express from "express";
import {
	retornaClientes,
	retornaClientesPorNome,
	adicionaCliente,
} from "./servico/clientes_servico.js";

const app = express();
app.use(express.json());

app.get("/clientes", async (req, res) => {
	const nome = req.query.nome;

	try {
		const resultado = nome
			? await retornaClientesPorNome(nome)
			: await retornaClientes();

		if (resultado.length > 0) {
			res.json(resultado);
		} else {
			res.status(404).json({ mensagem: "Nenhum cliente encontrado" });
		}
	} catch (erro) {
		console.error("Erro ao buscar clientes:", erro);
		res.status(500).json({ mensagem: "Erro interno no servidor" });
	}
});
app.post("/clientes", async (req, res) => {
	const {
		nome,
		senha,
		cpf,
		dataDeNascimento,
		email,
		telefone,
		contatoDeEmergencia,
		cep,
		numeroCasa,
		complemento,
		peso,
		altura,
		sexo,
		objetivo,
	} = req.body;

	const cliente = {
		nome,
		senha,
		cpf,
		dataDeNascimento,
		email,
		telefone,
		contatoDeEmergencia,
		endereco: { cep, numeroCasa, complemento },
		peso,
		altura,
		sexo,
		objetivo,
	};

	try {
		const resultado = await adicionaCliente(cliente);
		res.status(201).json({
			mensagem: "Cliente cadastrado com sucesso",
			id: resultado.insertId,
		});
	} catch (erro) {
		console.error("Erro ao cadastrar cliente:", erro);
		res.status(500).json({ erro: "Erro ao cadastrar cliente" });
	}
});

app.listen(9000, () => {
	console.log("Servidor rodando em http://localhost:9000");
});
