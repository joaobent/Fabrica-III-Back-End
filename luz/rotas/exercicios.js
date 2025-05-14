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
