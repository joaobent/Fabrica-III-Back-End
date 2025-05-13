import express from 'express';
import multer from 'multer';
const storage = multer.memoryStorage(); // salva o arquivo em buffer
const upload = multer({ storage: storage });
const routerCliente= express.Router();
import { retornaClientes, retornaClientesPorNome } from '../servico/buscar.js';
import { cadastrarCliente } from '../servico/adicionar.js';
import { atualizarCliente } from '../servico/atualizar.js';
import { atualizarClienteParcial } from '../servico/atualizar.js';
import { retornaClientePorId } from '../servico/buscar.js';
import { deletarClientePorId } from '../servico/deletar.js';

routerCliente.get('/', async (req, res) => {
	let resultado;
	const nome = req.query.nome;

	try {
		if (!nome) {
			resultado = await retornaClientes();
		} else if (nome) {
			resultado = await retornaClientesPorNome(nome);
		} 

		if (resultado.length > 0) {
			res.json(resultado);
		} else {
			res.status(404).json({ mensagem: "Nenhum cliente encontrado" });
		}
	} catch (erro) {
		console.error("Erro ao buscar cliente:", erro);
		console.log(resultado)
		res.status(500).json({ mensagem: "Erro interno no servidor" });
	}
});
routerCliente.get('/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const resultado = await retornaClientePorId(id);
		console.log("Resultado:", resultado);

		if (resultado.length > 0) {
			res.json(resultado[0]);
		} else {
			res.status(404).json({ mensagem: "Cliente não encontrado" });
		}
	} catch (erro) {
		console.error("Erro ao buscar cliente por ID:", erro.message);
		res.status(500).json({ mensagem: "Erro interno no servidor" });
	}
});


routerCliente.post('/', upload.fields([
  { name: 'fotoPerfil', maxCount: 1 }
]), async (req, res) => {
  const {
	nome, cpf, dataDeNascimento, email, telefone,
	contatoDeEmergencia, cep, numeroCasa, complemento,
	peso, altura, sexo,objetivo,
  } = req.body;

  const fotoPerfilBuffer = req.files?.fotoPerfil?.[0]?.buffer;
  const dados = {
	nome, cpf, dataDeNascimento, email, telefone,
	contatoDeEmergencia, peso, altura, sexo,
	objetivo, fotoPerfil: fotoPerfilBuffer,
	endereco: {
	  cep,
	  numeroCasa,
	  complemento
	},
  };

  try {
	const resultado = await cadastrarCliente(dados);
	res.status(201).json({
	  mensagem: 'Cliente cadastrado com sucesso',
	  id: resultado.insertId
	});
  } catch (erro) {
	console.error("Erro ao cadastrar cliente:", erro);
	res.status(500).json({ erro: 'Erro ao cadastrar cliente' });
  }
});

routerCliente.put('/:id', upload.none(), async (req, res) => {
  const { id } = req.params;

  const {
	nome, cpf, dataDeNascimento, email, telefone, contatoDeEmergencia, 
	cep, numeroCasa, complemento, peso,
	altura, sexo, objetivo,
	idendereco,
  } = req.body;

  const dados = {
	idclientes: id, nome, cpf, dataDeNascimento,
	email, telefone, contatoDeEmergencia,
	peso, altura, sexo, objetivo,
	endereco: {
	  idendereco,
	  cep,
	  numeroCasa,
	  complemento
	},
  };

  try {
	const resultado = await atualizarCliente(dados);

	if (resultado.sucesso) {
	  res.json({ mensagem: 'Cliente atualizado com sucesso' });
	} else {
	  res.status(400).json({ mensagem: 'Falha ao atualizar cliente' });
	}
  } catch (erro) {
	console.error("Erro ao atualizar cliente:", erro);
	res.status(500).json({ erro: 'Erro ao atualizar cliente' });
  }
});

routerCliente.patch('/:id', upload.none(), async (req, res) => {
	const { id } = req.params;

	try {
		const dadosParciais = req.body;

		if (dadosParciais.endereco && typeof dadosParciais.endereco === 'string') {
			dadosParciais.endereco = JSON.parse(dadosParciais.endereco);
		}

		const resultado = await atualizarClienteParcial(id, dadosParciais);

		if (resultado.sucesso) {
			res.json({ mensagem: 'Dados atualizados com sucesso' });
		} else {
			res.status(400).json({ mensagem: 'Falha ao atualizar cliente' });
		}
	} catch (erro) {
		console.error('Erro ao atualizar parcialmente cliente:', erro);
		res.status(500).json({ erro: 'Erro ao atualizar parcialmente cliente' });
	}
});

routerCliente.delete('/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const resultado = await deletarClientePorId(id);

		if (resultado.affectedRows > 0) {
			res.json({ mensagem: 'Cliente deletado com sucesso' });
		} else {
			res.status(404).json({ mensagem: 'Cliente não encontrado' });
		}
	} catch (erro) {
		console.error("Erro ao deletar cliente:", erro);
		res.status(500).json({ erro: 'Erro ao deletar cliente' });
	}
});

export default routerCliente;