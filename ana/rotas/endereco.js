import express from 'express';
const routerEndereco = express.Router();

import { buscarEnderecoPorFuncionarioId, buscarTodosEnderecos } from '../servicos/endereco/buscar.js';
import { deletarEndereco } from '../servicos/endereco/deletar.js';

routerEndereco.get('/:id', async (req, res) => {
  // #swagger.tags = ['Endereço']
  // #swagger.description = 'Busca o endereço pelo ID do funcionário.'
  // #swagger.parameters['id'] = { in: 'path', description: 'ID do funcionário para buscar o endereço', required: true, type: 'string' }
  /* #swagger.responses[200] = { 
        description: 'Endereço encontrado com sucesso.',
        schema: { $ref: '#/definitions/Endereco' }
  } */
  /* #swagger.responses[404] = { 
        description: 'Endereço não encontrado.',
        schema: { mensagem: 'Endereço não encontrado.' }
  } */
  /* #swagger.responses[500] = {
        description: 'Erro interno ao buscar endereço.',
        schema: { mensagem: 'Erro ao buscar endereço.' }
  } */

  const id = req.params.id;
  try {
    const endereco = await buscarEnderecoPorFuncionarioId(id);

    if (endereco) {
      res.status(200).json(endereco);
    } else {
      res.status(404).json({ mensagem: 'Endereço não encontrado.' });
    }
  } catch (erro) {
    console.error('Erro ao buscar endereço:', erro);
    res.status(500).json({ mensagem: 'Erro ao buscar endereço.' });
  }
});

routerEndereco.get('/', async (req, res) => {
  // #swagger.tags = ['Endereço']
  // #swagger.description = 'Retorna todos os endereços cadastrados.'
  /* #swagger.responses[200] = { 
        description: 'Lista de endereços retornada com sucesso.',
        schema: [{ $ref: '#/definitions/Endereco' }]
  } */
  /* #swagger.responses[404] = { 
        description: 'Nenhum endereço encontrado.',
        schema: { mensagem: 'Nenhum endereço encontrado.' }
  } */
  /* #swagger.responses[500] = {
        description: 'Erro interno ao buscar endereços.',
        schema: { mensagem: 'Erro ao buscar endereços.' }
  } */

  try {
    const enderecos = await buscarTodosEnderecos();

    if (enderecos.length > 0) {
      res.status(200).json(enderecos);
    } else {
      res.status(404).json({ mensagem: 'Nenhum endereço encontrado.' });
    }
  } catch (erro) {
    console.error('Erro ao buscar endereços:', erro);
    res.status(500).json({ mensagem: 'Erro ao buscar endereços.' });
  }
});

routerEndereco.delete('/:id', async (req, res) => {
  // #swagger.tags = ['Endereço']
  // #swagger.description = 'Deleta um endereço pelo ID.'
  // #swagger.parameters['id'] = { in: 'path', description: 'ID do endereço a ser deletado', required: true, type: 'string' }
  /* #swagger.responses[200] = { 
        description: 'Endereço deletado com sucesso.',
        schema: { mensagem: 'Endereço deletado com sucesso.' }
  } */
  /* #swagger.responses[400] = { 
        description: 'Endereço vinculado a outra entidade e não pode ser deletado.',
        schema: { mensagem: 'Endereço está vinculado a um [origem] e não pode ser deletado.' }
  } */
  /* #swagger.responses[404] = { 
        description: 'Endereço não encontrado.',
        schema: { mensagem: 'Endereço não encontrado.' }
  } */
  /* #swagger.responses[500] = {
        description: 'Erro interno ao deletar endereço.',
        schema: { mensagem: 'Erro ao deletar endereço.' }
  } */

  const id = req.params.id;

  try {
    const resultado = await deletarEndereco(id);

    if (resultado.bloqueado) {
      return res.status(400).json({ 
        mensagem: `Endereço está vinculado a um ${resultado.origem} e não pode ser deletado.` 
      });
    }

    if (resultado.deletado) {
      return res.status(200).json({ mensagem: 'Endereço deletado com sucesso.' });
    } else {
      return res.status(404).json({ mensagem: 'Endereço não encontrado.' });
    }
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao deletar endereço.' });
  }
});

export default routerEndereco;
