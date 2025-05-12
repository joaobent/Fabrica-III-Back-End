import express from 'express';
import multer from 'multer';
const storage = multer.memoryStorage(); // salva o arquivo em buffer
const upload = multer({ storage: storage });
const routerCliente= express.Router();
import { retornaCliente, retornaClientePorNome } from '../servico/buscar.js';
import { cadastrarCliente } from '../servico/adicionar.js';

routerCliente.get('/', async (req, res) => {
	let resultado;
	const nome = req.query.nome;

	try {
		if (!nome) {
			resultado = await retornaCliente();
		} else if (nome) {
			resultado = await retornaClientePorNome(nome);
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

routerCliente.post('/', upload.fields([
  { name: 'fotoPerfil', maxCount: 1 }
]), async (req, res) => {
  const {
	nome,
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

  const fotoPerfilBuffer = req.files?.fotoPerfil?.[0]?.buffer;

  const dados = {
	nome,
	cpf,
	dataDeNascimento,
	email,
	telefone,
	contatoDeEmergencia,
	peso,
	altura,
	sexo,
	objetivo,
	fotoPerfil: fotoPerfilBuffer,
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

export default routerCliente;