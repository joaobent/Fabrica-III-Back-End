import express from 'express';
import multer from 'multer';
const storage = multer.memoryStorage(); // salva o arquivo em buffer
const upload = multer({ storage: storage });
const routerFuncionario= express.Router();
import { retornaFuncionarios, retornaFuncionariosPorNome, retornaFuncionarioPorid } from '../servicos/funcionariosServicos/buscar.js';
import { cadastrarFuncionario } from '../servicos/funcionariosServicos/adicionar.js';
import { deletarFuncionarioPorId } from '../servicos/funcionariosServicos/deletar.js';
import { atualizarFuncionario } from '../servicos/funcionariosServicos/editar.js';
import { validarFuncionario, validarAtualizacaoFuncionario} from '../validacao/validacaoFuncionario.js'


routerFuncionario.put('/:id', async (req, res) => {
  const id = req.params.id;
  const dados = req.body;

  const funcionarioExistente = await retornaFuncionarioPorId(id);


  if (!funcionarioExistente) {
    return res.status(404).json({ erro: 'Funcionário não encontrado para o ID informado.' });
  }

  const erros = validarAtualizacaoFuncionario(dados);
  if (erros.length > 0) {
    return res.status(400).json({ mensagem: "Erro de validação", erros });
  }

  try {
    const resultado = await atualizarFuncionario(id, dados);
    res.status(200).json({ mensagem: 'Funcionário atualizado com sucesso.', resultado });
  } catch (erro) {
    console.error('Erro ao atualizar funcionário:', erro);
    res.status(500).json({ erro: 'Erro interno ao atualizar funcionário.' });
  }
});


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

routerFuncionario.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const funcionario = await retornaFuncionarioPorid(id);

    if (!funcionario) {
      return res.status(404).json({ mensagem: 'Funcionário não encontrado para o ID informado.' });
    }

    res.status(200).json(funcionario);
  } catch (erro) {
    console.error('Erro ao buscar funcionário por ID:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor ao buscar funcionário.' });
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

  const erros = validarFuncionario(dados);
  if (erros.length > 0) {
    return res.status(400).json({
      mensagem: "Erro de validação",
      erros: erros
    });
  }

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