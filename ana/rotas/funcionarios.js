import express from 'express';
import multer from 'multer';
const storage = multer.memoryStorage(); // salva o arquivo em buffer
const upload = multer({ storage: storage });
const routerFuncionario= express.Router();
import { retornaFuncionarios, retornaFuncionariosPorNome, retornaFuncionarioPorid, buscarFotoPerfilPorId} from '../servicos/funcionariosServicos/buscar.js';
import { cadastrarFuncionario } from '../servicos/funcionariosServicos/adicionar.js';
import { deletarFuncionarioPorId } from '../servicos/funcionariosServicos/deletar.js';
import { atualizarFuncionario, atualizarFuncionarioParcial} from '../servicos/funcionariosServicos/editar.js';
import { validarFuncionario, validarAtualizacaoFuncionario} from '../validacao/validacaoFuncionario.js'



routerFuncionario.patch('/:id', upload.fields([
  { name: 'fotoPerfil', maxCount: 1 },
  { name: 'certificado', maxCount: 1 }
]), async (req, res, next) => {
  // #swagger.tags = ['Funcionário']
// #swagger.description = 'Atualiza parcialmente os dados de um funcionário pelo ID.'
// #swagger.parameters['id'] = { in: 'path', description: 'ID do funcionário', required: true, type: 'string' }
/* #swagger.responses[200] = {
      description: 'Funcionário atualizado com sucesso.',
      schema: { mensagem: 'Funcionário atualizado com sucesso!' }
} */
/* #swagger.responses[400] = {
      description: 'Erro de validação.',
      schema: { erros: ['Campo inválido'] }
} */
/* #swagger.responses[404] = {
      description: 'Funcionário não encontrado.',
      schema: { mensagem: 'Funcionário não encontrado ou nenhum dado alterado.' }
} */
/* #swagger.responses[500] = {
      description: 'Erro interno ao atualizar funcionário.',
      schema: { mensagem: 'Erro interno no servidor.' }
} */
  const id = req.params.id;

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
    formacao,
    idEndereco,
    idFormacao
  } = req.body;

  const fotoPerfilBuffer = req.files?.fotoPerfil?.[0]?.buffer;
  const certificadoBuffer = req.files?.certificado?.[0]?.buffer;

  // Monta objeto dados para atualização parcial
  const dados = {};

  if (nome !== undefined) dados.nome = nome;
  if (senha !== undefined) dados.senha = senha;
  if (cpf !== undefined) dados.cpf = cpf;
  if (dataDeNascimento !== undefined) dados.dataDeNascimento = dataDeNascimento;
  if (email !== undefined) dados.email = email;
  if (telefone !== undefined) dados.telefone = telefone;
  if (fotoPerfilBuffer !== undefined) dados.fotoPerfil = fotoPerfilBuffer;

  if (cep !== undefined || numeroCasa !== undefined || complemento !== undefined || idEndereco !== undefined) {
  dados.endereco = {};
  if (cep !== undefined) dados.endereco.cep = cep;
  if (numeroCasa !== undefined) dados.endereco.numeroCasa = numeroCasa;
  if (complemento !== undefined) dados.endereco.complemento = complemento;
  if (idEndereco !== undefined) dados.endereco.idEndereco = Number(idEndereco); // ✅ Aqui está certo
}

  if (formacao !== undefined || certificadoBuffer !== undefined || idFormacao !== undefined) {
  dados.formacao = {};
  if (formacao !== undefined) dados.formacao.formacao = formacao;
  if (certificadoBuffer !== undefined) dados.formacao.certificado = certificadoBuffer;
  if (idFormacao !== undefined) dados.formacao.idFormacao = Number(idFormacao); // ✅ Correto
}

  // Chama sua função de validação para update parcial
  const erros = validarAtualizacaoFuncionario(dados);

  if (erros.length > 0) {
    return res.status(400).json({ erros });
  }

  try {
    const resultado = await atualizarFuncionarioParcial(id, dados);

    if (resultado) {
      res.status(200).json({ mensagem: 'Funcionário atualizado com sucesso!' });
    } else {
      res.status(404).json({ mensagem: 'Funcionário não encontrado ou nenhum dado alterado.' });
    }
  } catch (erro) {
    console.error('Erro ao atualizar funcionário:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
});

routerFuncionario.put('/:id', upload.fields([
  { name: 'fotoPerfil', maxCount: 1 },
  { name: 'certificado', maxCount: 1 }
]), validarAtualizacaoFuncionario, async (req, res) => {
  // #swagger.tags = ['Funcionário']
// #swagger.description = 'Atualiza completamente os dados de um funcionário pelo ID.'
// #swagger.parameters['id'] = { in: 'path', description: 'ID do funcionário', required: true, type: 'string' }
/* #swagger.responses[200] = {
      description: 'Funcionário atualizado com sucesso.',
      schema: { mensagem: 'Funcionário atualizado com sucesso!' }
} */
/* #swagger.responses[404] = {
      description: 'Funcionário não encontrado.',
      schema: { mensagem: 'Funcionário não encontrado ou nenhum dado alterado.' }
} */
/* #swagger.responses[500] = {
      description: 'Erro interno ao atualizar funcionário.',
      schema: { mensagem: 'Erro interno no servidor.' }
} */
  const id = req.params.id;

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

  const fotoPerfilBuffer = req.files?.fotoPerfil?.[0]?.buffer;
  const certificadoBuffer = req.files?.certificado?.[0]?.buffer;

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
    const resultado = await atualizarFuncionario(id, dados);

    if (resultado) {
      res.status(200).json({ mensagem: 'Funcionário atualizado com sucesso!' });
    } else {
      res.status(404).json({ mensagem: 'Funcionário não encontrado ou nenhum dado alterado.' });
    }
  } catch (erro) {
    console.error('Erro ao atualizar funcionário:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
});


routerFuncionario.get('/', async (req, res) => {
  // #swagger.tags = ['Funcionário']
// #swagger.description = 'Retorna todos os funcionários ou filtra por nome usando query.'
// #swagger.parameters['nome'] = { in: 'query', description: 'Nome do funcionário para filtrar', required: false, type: 'string' }
/* #swagger.responses[200] = {
      description: 'Funcionários encontrados.',
      schema: [{ id: 1, nome: 'Exemplo' }]
} */
/* #swagger.responses[400] = {
      description: 'Nome inválido para busca.',
      schema: { mensagem: 'Por favor, informe um nome válido para buscar.' }
} */
/* #swagger.responses[404] = {
      description: 'Nenhum funcionário encontrado.',
      schema: { mensagem: 'Nenhum funcionário encontrado' }
} */
/* #swagger.responses[500] = {
      description: 'Erro interno ao buscar funcionários.',
      schema: { mensagem: 'Erro interno no servidor' }
} */
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
  // #swagger.tags = ['Funcionário']
// #swagger.description = 'Retorna os dados de um funcionário pelo ID.'
// #swagger.parameters['id'] = { in: 'path', description: 'ID do funcionário', required: true, type: 'string' }
/* #swagger.responses[200] = {
      description: 'Funcionário encontrado.',
      schema: { id: 1, nome: 'Exemplo' }
} */
/* #swagger.responses[404] = {
      description: 'Funcionário não encontrado.',
      schema: { mensagem: 'Funcionário não encontrado para o ID informado.' }
} */
/* #swagger.responses[500] = {
      description: 'Erro interno ao buscar funcionário.',
      schema: { mensagem: 'Erro interno no servidor ao buscar funcionário.' }
} */
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



routerFuncionario.get('/:id/fotoPerfil', async (req, res) => {
  // #swagger.tags = ['Funcionário']
// #swagger.description = 'Retorna a foto de perfil do funcionário pelo ID.'
// #swagger.parameters['id'] = { in: 'path', description: 'ID do funcionário', required: true, type: 'string' }
/* #swagger.responses[200] = {
      description: 'Foto de perfil retornada com sucesso.'
} */
/* #swagger.responses[404] = {
      description: 'Foto de perfil não encontrada.',
      schema: { erro: 'Foto de perfil não encontrada.' }
} */
/* #swagger.responses[500] = {
      description: 'Erro ao buscar foto de perfil.',
      schema: { erro: 'Erro ao buscar foto de perfil.' }
} */
  const id = req.params.id;
  try {
    const funcionario = await buscarFotoPerfilPorId(id);
    if (!funcionario || !funcionario.fotoPerfil) {
      return res.status(404).json({ erro: 'Foto de perfil não encontrada.' });
    }

    res.setHeader('Content-Type', 'image/jpeg'); // ou image/png conforme o tipo da imagem
    res.send(funcionario.fotoPerfil);
  } catch (erro) {
    console.error('Erro ao buscar foto de perfil:', erro);
    res.status(500).json({ erro: 'Erro ao buscar foto de perfil.' });
  }
});


routerFuncionario.post('/', upload.fields([
  { name: 'certificado', maxCount: 1 },
  { name: 'fotoPerfil', maxCount: 1 }
]), async (req, res) => {
  // #swagger.tags = ['Funcionário']
// #swagger.description = 'Cadastra um novo funcionário.'
/* #swagger.responses[201] = {
      description: 'Funcionário cadastrado com sucesso.',
      schema: { mensagem: 'Funcionário cadastrado com sucesso', id: 1 }
} */
/* #swagger.responses[400] = {
      description: 'Erro de validação.',
      schema: { mensagem: 'Erro de validação', erros: ['Campo obrigatório'] }
} */
/* #swagger.responses[500] = {
      description: 'Erro ao cadastrar funcionário.',
      schema: { erro: 'Erro ao cadastrar funcionário' }
} */
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
  // #swagger.tags = ['Funcionário']
// #swagger.description = 'Deleta um funcionário pelo ID.'
// #swagger.parameters['id'] = { in: 'path', description: 'ID do funcionário', required: true, type: 'string' }
/* #swagger.responses[200] = {
      description: 'Funcionário deletado com sucesso.',
      schema: { mensagem: 'Funcionário deletado com sucesso' }
} */
/* #swagger.responses[404] = {
      description: 'Funcionário não encontrado.',
      schema: { mensagem: 'Funcionário não encontrado' }
} */
/* #swagger.responses[500] = {
      description: 'Erro interno ao deletar funcionário.',
      schema: { mensagem: 'Erro interno no servidor' }
} */
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