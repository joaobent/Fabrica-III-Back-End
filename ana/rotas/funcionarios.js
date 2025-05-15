import express from 'express';
import multer from 'multer';
const storage = multer.memoryStorage(); // salva o arquivo em buffer
const upload = multer({ storage: storage });
const routerFuncionario= express.Router();
import { retornaFuncionarios, retornaFuncionariosPorNome } from '../servicos/funcionariosServicos/buscar.js';
import { cadastrarFuncionario } from '../servicos/funcionariosServicos/adicionar.js';
import { deletarFuncionarioPorId } from '../servicos/funcionariosServicos/deletar.js';

routerFuncionario.get('/', async (req, res) => {
    let resultado;
    const nome = req.query.nome;

    try {
        if (!nome) {
            resultado = await retornaFuncionarios();
        } else if (nome) {
           if (!/[a-zA-Z]/.test(nome)) {
                return res.status(400).json({ mensagem: "Por favor, informe um nome válido para buscar." });
            }
            resultado = await retornaFuncionariosPorNome(nome);
        } 

        if (resultado.length > 0) {
            res.json(resultado);
        } else {
            res.status(404).json({ mensagem: "Nenhum funcionário encontrado" });
        }
    } catch (erro) {
        console.error("Erro ao buscar funcionários:", erro);
        console.log(resultado)
        res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
});

routerFuncionario.post('/', upload.fields([
  { name: 'certificado', maxCount: 1 },
  { name: 'fotoPerfil', maxCount: 1 }
]), async (req, res) => {
  const {
    nome,
    senha,
    cpf,
    dataDeNascimento,
    email,
    telefone,
    cep,
    numeroCasa,
    complemento,
    formacao
  } = req.body;

  const certificadoBuffer = req.files?.certificado?.[0]?.buffer;
  const fotoPerfilBuffer = req.files?.fotoPerfil?.[0]?.buffer;

  const dados = {
    nome,
    senha,
    cpf,
    dataDeNascimento,
    email,
    telefone,
    fotoPerfil: fotoPerfilBuffer,
    endereco: {
      cep,
      numeroCasa,
      complemento
    },
    formacao: {
      formacao,
      certificado: certificadoBuffer
    }
  };

  try {
    const resultado = await cadastrarFuncionario(dados);
    res.status(201).json({
      mensagem: 'Funcionário cadastrado com sucesso',
      id: resultado.insertId
    });
  } catch (erro) {
    console.error("Erro ao cadastrar funcionário:", erro);
    res.status(500).json({ erro: 'Erro ao cadastrar funcionário' });
  }
});

routerFuncionario.delete('/:id', async (req, res)=> {
  const id = req.params.id;

  try {
    const resultado = await deletarFuncionarioPorId(id);
    
    if (resultado.affectedRows > 0) {
      res.json({ mensagem: 'Funcionário deletado com sucesso' });
    } else {
      res.status(404).json({ mensagem: 'Funcionário não encontrado' });
    }
  } catch (erro) {
    console.error('Erro ao deletar funcionário:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
});
export default routerFuncionario;