import express from 'express';
import {
  apresentarExercicios,
  apresentarExercicioPorId
} from '../servicos/exercicioServicos/buscar.js';
import { adicionarExercicio } from '../servicos/exercicioServicos/adicionar.js';
import { editarExercicio } from '../servicos/exercicioServicos/editar.js';
import { deletarExercicio } from '../servicos/exercicioServicos/deletar.js';
import {
  validarExercicio,
  validarExercicioParcial
} from '../validacao/exercicioValidacao.js';
import { validarFuncionarioComFormacao } from '../validacao/exercicioValidacao.js';

const routerExercicios = express.Router();

function validarId(id) {
  return !isNaN(id);
}

// GET todos os exercícios
routerExercicios.get('/', async (req, res) => {
   /*
    #swagger.tags = ['Exercícios']
    #swagger.description = 'Retorna todos os exercícios cadastrados.'
    #swagger.responses[200] = {
      description: 'Lista de exercícios retornada com sucesso.',
      schema: { 
        status: 'success', 
        dados: [{
          id: 1,
          quantDeSeries: 3,
          quantDeRepeticoes: 12,
          diaDaSemana: "Segunda",
          parteDoCorpo: "Peito",
          clientes_idclientes: 1,
          funcionarios_idfuncionarios: 2,
          funcionarios_formacao_idformacao: 1,
          equipamentos_idequipamentos: 5,
          equipamentos_marca_idmarca: 3
        }]
      }
    }
    #swagger.responses[500] = {
      description: 'Erro interno ao buscar exercícios.',
      schema: { status: 'error', mensagem: 'Erro ao buscar exercícios' }
    }
  */
  try {
    const resultado = await apresentarExercicios();
    return res.status(200).json({ status: 'success', dados: resultado });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ status: 'error', mensagem: 'Erro ao buscar exercícios' });
  }
});

// GET exercício por ID
routerExercicios.get('/:id', async (req, res) => {
  /*
    #swagger.tags = ['Exercícios']
    #swagger.description = 'Retorna um exercício específico pelo ID.'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do exercício a ser buscado.',
      required: true,
      type: 'string',
      example: '1'
    }
    #swagger.responses[200] = {
      description: 'Exercício encontrado e retornado com sucesso.',
      schema: { status: 'success', dados: { objeto exercício } 
    }
    #swagger.responses[400] = {
      description: 'ID inválido.',
      schema: { status: 'error', mensagem: 'ID inválido' }
    }
    #swagger.responses[404] = {
      description: 'Exercício não encontrado.',
      schema: { status: 'error', mensagem: 'Exercício não encontrado' }
    }
    #swagger.responses[500] = {
      description: 'Erro interno ao buscar exercício.',
      schema: { status: 'error', mensagem: 'Erro ao buscar exercício' }
    }
  */
  const { id } = req.params;

  if (!validarId(id)) {
    return res.status(400).json({ status: 'error', mensagem: 'ID inválido' });
  }

  try {
    const resultado = await apresentarExercicioPorId(id);
    if (!resultado.length) {
      return res.status(404).json({ status: 'error', mensagem: 'Exercício não encontrado' });
    }

    return res.status(200).json({ status: 'success', dados: resultado });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ status: 'error', mensagem: 'Erro ao buscar exercício' });
  }
});

// POST - Adicionar exercício
routerExercicios.post('/', async (req, res) => {
   /*
    #swagger.tags = ['Exercícios']
    #swagger.description = 'Adiciona um novo exercício.'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Objeto com os dados do exercício.',
      required: true,
      schema: {
        quantDeSeries: 3,
        quantDeRepeticoes: 12,
        diaDaSemana: "Segunda",
        parteDoCorpo: "Peito",
        clientes_idclientes: 1,
        funcionarios_idfuncionarios: 2,
        funcionarios_formacao_idformacao: 1,
        equipamentos_idequipamentos: 5,
        equipamentos_marca_idmarca: 3
      }
    }
    #swagger.responses[201] = {
      description: 'Exercício cadastrado com sucesso.',
      schema: { status: 'success', mensagem: 'Exercício cadastrado com sucesso!' }
    }
    #swagger.responses[400] = {
      description: 'Dados inválidos ou combinação funcionário/ formação inexistente.',
      schema: { status: 'error', mensagem: 'Mensagem de erro detalhada' }
    }
    #swagger.responses[500] = {
      description: 'Erro interno ao cadastrar exercício.',
      schema: { status: 'error', mensagem: 'Erro ao cadastrar exercício' }
    }
  */
  const {
    quantDeSeries,
    quantDeRepeticoes,
    diaDaSemana,
    parteDoCorpo,
    clientes_idclientes,
    funcionarios_idfuncionarios,
    funcionarios_formacao_idformacao,
    equipamentos_idequipamentos,
    equipamentos_marca_idmarca
  } = req.body;

  const validacao = await validarExercicio(
    quantDeSeries,
    quantDeRepeticoes,
    diaDaSemana,
    parteDoCorpo,
    clientes_idclientes,
    funcionarios_idfuncionarios,
    funcionarios_formacao_idformacao,
    equipamentos_idequipamentos,
    equipamentos_marca_idmarca
  );

  if (!validacao.status) {
    return res.status(400).json({ status: 'error', mensagem: validacao.mensagem });
  }

  const funcionarioExiste = await validarFuncionarioComFormacao(funcionarios_idfuncionarios, funcionarios_formacao_idformacao);
  if (!funcionarioExiste) {
    return res.status(400).json({ status: 'error', mensagem: 'Combinação de funcionário e formação inexistente' });
  }

  try {
    await adicionarExercicio(
      quantDeSeries,
      quantDeRepeticoes,
      diaDaSemana,
      parteDoCorpo,
      clientes_idclientes,
      funcionarios_idfuncionarios,
      funcionarios_formacao_idformacao,
      equipamentos_idequipamentos,
      equipamentos_marca_idmarca
    );

    return res.status(201).json({ status: 'success', mensagem: 'Exercício cadastrado com sucesso!' });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ status: 'error', mensagem: 'Erro ao cadastrar exercício' });
  }
});

// PATCH - Atualização parcial
routerExercicios.patch('/:id', async (req, res) => {
  /*
    #swagger.tags = ['Exercícios']
    #swagger.description = 'Atualiza parcialmente os dados de um exercício pelo ID.'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do exercício a ser atualizado.',
      required: true,
      type: 'string',
      example: '1'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Campos que deseja atualizar (parcial).',
      required: true,
      schema: {
        quantDeSeries: 4,
        quantDeRepeticoes: 10,
        // campos opcionais
      }
    }
    #swagger.responses[200] = {
      description: 'Exercício atualizado com sucesso.',
      schema: { status: 'success', mensagem: 'Exercício atualizado com sucesso!' }
    }
    #swagger.responses[400] = {
      description: 'Dados inválidos ou combinação funcionário/ formação inexistente.',
      schema: { status: 'error', mensagem: 'Mensagem de erro detalhada' }
    }
    #swagger.responses[404] = {
      description: 'Exercício não encontrado.',
      schema: { status: 'error', mensagem: 'Exercício não encontrado' }
    }
    #swagger.responses[500] = {
      description: 'Erro interno ao atualizar exercício.',
      schema: { status: 'error', mensagem: 'Erro ao atualizar exercício' }
    }
  */
  const { id } = req.params;

  if (!validarId(id)) {
    return res.status(400).json({ status: 'error', mensagem: 'ID inválido' });
  }

  const camposPermitidos = [
    'quantDeSeries',
    'quantDeRepeticoes',
    'diaDaSemana',
    'parteDoCorpo',
    'clientes_idclientes',
    'funcionarios_idfuncionarios',
    'funcionarios_formacao_idformacao',
    'equipamentos_idequipamentos',
    'equipamentos_marca_idmarca'
  ];

  const dados = {};
  for (const campo of camposPermitidos) {
    if (req.body[campo] !== undefined) {
      dados[campo] = req.body[campo];
    }
  }

  if (Object.keys(dados).length === 0) {
    return res.status(400).json({ status: 'error', mensagem: 'Nenhum dado fornecido para atualização' });
  }

  const validacao = await validarExercicioParcial(
    dados.quantDeSeries,
    dados.quantDeRepeticoes,
    dados.diaDaSemana,
    dados.parteDoCorpo,
    dados.clientes_idclientes,
    dados.funcionarios_idfuncionarios,
    dados.funcionarios_formacao_idformacao,
    dados.equipamentos_idequipamentos,
    dados.equipamentos_marca_idmarca
  );

  if (!validacao.status) {
    return res.status(400).json({ status: 'error', mensagem: validacao.mensagem });
  }

  // Se o par de funcionário + formação foi fornecido, validar
  if (dados.funcionarios_idfuncionarios && dados.funcionarios_formacao_idformacao) {
    const funcionarioExiste = await validarFuncionarioComFormacao(
      dados.funcionarios_idfuncionarios,
      dados.funcionarios_formacao_idformacao
    );

    if (!funcionarioExiste) {
      return res.status(400).json({ status: 'error', mensagem: 'Combinação de funcionário e formação inexistente' });
    }
  }

  try {
    const resultado = await editarExercicio(id, dados);
    if (!resultado || resultado.affectedRows === 0) {
      return res.status(404).json({ status: 'error', mensagem: 'Exercício não encontrado' });
    }

    return res.status(200).json({ status: 'success', mensagem: 'Exercício atualizado com sucesso!' });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ status: 'error', mensagem: 'Erro ao atualizar exercício' });
  }
});

// PUT - Atualização total
routerExercicios.put('/:id', async (req, res) => {
   /*
    #swagger.tags = ['Exercícios']
    #swagger.description = 'Atualiza totalmente um exercício pelo ID.'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do exercício a ser atualizado.',
      required: true,
      type: 'string',
      example: '1'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Objeto com todos os dados atualizados do exercício.',
      required: true,
      schema: {
        quantDeSeries: 4,
        quantDeRepeticoes: 10,
        diaDaSemana: "Terça",
        parteDoCorpo: "Costas",
        clientes_idclientes: 1,
        funcionarios_idfuncionarios: 2,
        funcionarios_formacao_idformacao: 1,
        equipamentos_idequipamentos: 5,
        equipamentos_marca_idmarca: 3
      }
    }
    #swagger.responses[200] = {
      description: 'Exercício atualizado com sucesso.',
      schema: { status: 'success', mensagem: 'Exercício atualizado com sucesso!' }
    }
    #swagger.responses[400] = {
      description: 'Dados inválidos ou combinação funcionário/ formação inexistente.',
      schema: { status: 'error', mensagem: 'Mensagem de erro detalhada' }
    }
    #swagger.responses[404] = {
      description: 'Exercício não encontrado.',
      schema: { status: 'error', mensagem: 'Exercício não encontrado' }
    }
    #swagger.responses[500] = {
      description: 'Erro interno ao atualizar exercício.',
      schema: { status: 'error', mensagem: 'Erro ao atualizar exercício' }
    }
  */
  const { id } = req.params;

  if (!validarId(id)) {
    return res.status(400).json({ status: 'error', mensagem: 'ID inválido' });
  }

  const {
    quantDeSeries,
    quantDeRepeticoes,
    diaDaSemana,
    parteDoCorpo,
    clientes_idclientes,
    funcionarios_idfuncionarios,
    funcionarios_formacao_idformacao,
    equipamentos_idequipamentos,
    equipamentos_marca_idmarca
  } = req.body;

  const validacao = await validarExercicio(
    quantDeSeries,
    quantDeRepeticoes,
    diaDaSemana,
    parteDoCorpo,
    clientes_idclientes,
    funcionarios_idfuncionarios,
    funcionarios_formacao_idformacao,
    equipamentos_idequipamentos,
    equipamentos_marca_idmarca
  );

  if (!validacao.status) {
    return res.status(400).json({ status: 'error', mensagem: validacao.mensagem });
  }

  const funcionarioExiste = await validarFuncionarioComFormacao(funcionarios_idfuncionarios, funcionarios_formacao_idformacao);
  if (!funcionarioExiste) {
    return res.status(400).json({ status: 'error', mensagem: 'Combinação de funcionário e formação inexistente' });
  }

  const dados = {
    quantDeSeries,
    quantDeRepeticoes,
    diaDaSemana,
    parteDoCorpo,
    clientes_idclientes,
    funcionarios_idfuncionarios,
    funcionarios_formacao_idformacao,
    equipamentos_idequipamentos,
    equipamentos_marca_idmarca
  };

  try {
    const resultado = await editarExercicio(id, dados);
    if (!resultado || resultado.affectedRows === 0) {
      return res.status(404).json({ status: 'error', mensagem: 'Exercício não encontrado' });
    }

    return res.status(200).json({ status: 'success', mensagem: 'Exercício atualizado com sucesso!' });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ status: 'error', mensagem: 'Erro ao atualizar exercício' });
  }
});

// DELETE
routerExercicios.delete('/:id', async (req, res) => {
   /*
    #swagger.tags = ['Exercícios']
    #swagger.description = 'Remove um exercício pelo ID.'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do exercício a ser deletado.',
      required: true,
      type: 'string',
      example: '1'
    }
    #swagger.responses[200] = {
      description: 'Exercício deletado com sucesso.',
      schema: { status: 'success', mensagem: 'Exercício deletado com sucesso!' }
    }
    #swagger.responses[400] = {
      description: 'ID inválido.',
      schema: { status: 'error', mensagem: 'ID inválido' }
    }
    #swagger.responses[404] = {
      description: 'Exercício não encontrado.',
      schema: { status: 'error', mensagem: 'Exercício não encontrado' }
    }
    #swagger.responses[500] = {
      description: 'Erro interno ao deletar exercício.',
      schema: { status: 'error', mensagem: 'Erro ao deletar exercício' }
    }
  */

  const { id } = req.params;

  if (!validarId(id)) {
    return res.status(400).json({ status: 'error', mensagem: 'ID inválido' });
  }

  try {
    const resultado = await deletarExercicio(id);
    if (!resultado || resultado.affectedRows === 0) {
      return res.status(404).json({ status: 'error', mensagem: 'Exercício não encontrado' });
    }

    return res.status(200).json({ status: 'success', mensagem: 'Exercício deletado com sucesso!' });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ status: 'error', mensagem: 'Erro ao deletar exercício' });
  }
});

export default routerExercicios;
