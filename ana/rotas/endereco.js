import express from 'express';
const routerEndereco = express.Router();

import { buscarEnderecoPorFuncionarioId, buscarTodosEnderecos } from '../servicos/endereco/buscar.js';
import { deletarEndereco } from '../servicos/endereco/deletar.js';

/**
 * @swagger
 * /endereco/{id}:
 *   get:
 *     tags: [Endereço]
 *     summary: Buscar endereço pelo ID do funcionário
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do funcionário
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Endereço encontrado com sucesso
 *       404:
 *         description: Endereço não encontrado
 *       500:
 *         description: Erro no servidor
 */
routerEndereco.get('/:id', async (req, res) => {
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

/**
 * @swagger
 * /endereco:
 *   get:
 *     tags: [Endereço]
 *     summary: Buscar todos os endereços
 *     responses:
 *       200:
 *         description: Lista de endereços retornada com sucesso
 *       404:
 *         description: Nenhum endereço encontrado
 *       500:
 *         description: Erro no servidor
 */
routerEndereco.get('/', async (req, res) => {
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

/**
 * @swagger
 * /endereco/{id}:
 *   delete:
 *     tags: [Endereço]
 *     summary: Deletar um endereço pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do endereço a ser deletado
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Endereço deletado com sucesso
 *       400:
 *         description: Endereço vinculado e não pode ser deletado
 *       404:
 *         description: Endereço não encontrado
 *       500:
 *         description: Erro no servidor
 */
routerEndereco.delete('/:id', async (req, res) => {
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
