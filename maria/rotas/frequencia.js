import express from 'express';
// import pool from './servico/conexao.js';
const routerFrequencia= express.Router();
import { retornaFrequencias, buscarFrequenciaPorId, retornaFrequenciasPorClienteId } from "../servicos/frequenciaServicos/buscar.js";
import { cadastraFrequencia } from "../servicos/frequenciaServicos/adicionar.js";
import { atualizaFrequencia } from "../servicos/frequenciaServicos/editar.js";
import { atualizaFrequenciaParcial } from '../servicos/frequenciaServicos/editartudo.js';
import { deletarFrequencia } from '../servicos/frequenciaServicos/deletar.js';
import { validarFrequencia, validarExistenciaFrequencia, validarFrequenciaParcial } from '../validacao/frequenciaValidacao.js';
import bodyParser from 'body-parser'; // Importando o body-parser


const app = express();

// ESSA LINHA É ESSENCIAL:
app.use(express.json());

/**
 * @swagger
 * /frequencia:
 *   get:
 *     summary: Retorna todas as frequências
 *     responses:
 *       200:
 *         description: Lista de frequências
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   idfrequencia:
 *                     type: integer
 *                   dataEntrada:
 *                     type: string
 *                   dataSaida:
 *                     type: string
 *                   clientes_idclientes:
 *                     type: integer
 */

routerFrequencia.get('/', async (req, res) => {
  const { id } = req.params;

    try {
        const frequencias = await retornaFrequencias();
         if (!frequencias || frequencias.length === 0) {
      return res.status(404).json({ mensagem: 'Frequência não encontrada' });
    }

    res.json(frequencias);
    } catch (erro) {
        console.error('Erro ao buscar frequências por ID:', erro);
        res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
});

/**
 * @swagger
 * /frequencia/{id}:
 *   get:
 *     tags: [Frequência]
 *     summary: Busca uma frequência por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Frequência encontrada
 *         content:
 *           application/json:
 *             example:
 *               idfrequencia: 1
 *               idcliente: 2
 *               data: "2025-05-10"
 *               horaentrada: "08:00"
 *               horasaida: "09:00"
 */

// Rota para buscar uma frequência por ID
routerFrequencia.get('/:id', async (req, res) => {
    const { id } = req.params;

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ mensagem: 'ID inválido.' });
  }

    try {
        const frequencias = await buscarFrequenciaPorId(id);

        if (!frequencias || frequencias.length === 0) {
      return res.status(404).json({ mensagem: 'Frequência não encontrada' });
    }

    res.json(frequencias);
    } catch (erro) {
        console.error('Erro ao buscar frequência por ID:', erro);
        res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
});


/**
 * @swagger
 * /frequencia/cliente/{idcliente}:
 *   get:
 *     tags: [Frequência]
 *     summary: Lista as frequências de um cliente específico
 *     parameters:
 *       - in: path
 *         name: idcliente
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Lista de frequências do cliente
 *         content:
 *           application/json:
 *             example:
 *               - idfrequencia: 3
 *                 idcliente: 2
 *                 data: "2025-05-15"
 *                 horaentrada: "07:30"
 *                 horasaida: "08:30"
 */

// GET - Frequências por ID do Cliente
routerFrequencia.get('/cliente/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ mensagem: 'ID do cliente inválido.' });
  }

  try {
    const frequencias = await retornaFrequenciasPorClienteId(id);

    if (!frequencias || frequencias.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhuma frequência encontrada para este cliente.' });
    }

    res.status(200).json(frequencias);
  } catch (erro) {
    console.error('Erro ao buscar frequência por ID do cliente:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
});

/**
 * @swagger
 * /frequencia:
 *   post:
 *     tags: [Frequência]
 *     summary: Cadastra uma nova frequência
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             idcliente: 2
 *             data: "2025-05-18"
 *             horaentrada: "07:00"
 *             horasaida: "08:00"
 *     responses:
 *       201:
 *         description: Frequência cadastrada com sucesso
 */

// Usando o bodyParser para lidar com JSON
app.use(bodyParser.json());  // Isso vai garantir que o body seja interpretado corretamente

// Rota POST para criação de frequência
routerFrequencia.post('/', async (req, res) => {
  try {
    const { clientes_idclientes, dataEntrada, dataSaida } = req.body;

    const validacao = await validarFrequencia(clientes_idclientes, dataEntrada, dataSaida);
    if (!validacao.status) {
    return res.status(400).json({ mensagem: validacao.mensagem });
  }

    if (!clientes_idclientes || !dataEntrada || !dataSaida) {
      return res.status(400).json({ mensagem: 'Dados incompletos' });
    }

    if (isNaN(clientes_idclientes) || clientes_idclientes <= 0) {
      return res.status(400).json({ mensagem: 'ID do cliente inválido.' });
    }

    const id = await cadastraFrequencia(clientes_idclientes, dataEntrada, dataSaida);

    res.status(201).json({ mensagem: 'Frequência criada com sucesso', id });
  } catch (erro) {
    console.error('Erro ao cadastrar frequência:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
});


/**
 * @swagger
 * /frequencia/{id}:
 *   put:
 *     tags: [Frequência]
 *     summary: Atualiza todos os dados de uma frequência
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da frequência
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             idcliente: 2
 *             data: "2025-05-20"
 *             horaentrada: "08:00"
 *             horasaida: "09:00"
 *     responses:
 *       200:
 *         description: Frequência atualizada com sucesso
 */

// Rota para atualizar uma frequência existente
routerFrequencia.put('/:id', async (req, res) => {
  const idfrequencia = req.params.id;
  const { clientes_idclientes, dataEntrada, dataSaida } = req.body;

  if (isNaN(idfrequencia) || idfrequencia <= 0) {
    return res.status(400).json({ mensagem: 'ID inválido.' });
  }

  const existe = await validarExistenciaFrequencia(idfrequencia);
  if (!existe.status) {
    return res.status(404).json({ mensagem: existe.mensagem });
  }

  const validacao = await validarFrequencia(clientes_idclientes, dataEntrada, dataSaida);
  if (!validacao.status) {
    return res.status(400).json({ mensagem: validacao.mensagem });
  }

  try {
    const resultado = await atualizaFrequencia(idfrequencia, clientes_idclientes, dataEntrada, dataSaida);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Frequência não encontrada' });
    }

    res.json({ mensagem: 'Frequência atualizada com sucesso' });
  } catch (erro) {
    console.error('Erro ao atualizar frequência:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor' });
  }
});

/**
 * @swagger
 * /frequencia/{id}:
 *   patch:
 *     tags: [Frequência]
 *     summary: Atualiza parcialmente os dados de uma frequência
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da frequência
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             horaentrada: "08:30"
 *     responses:
 *       200:
 *         description: Frequência parcialmente atualizada
 */

routerFrequencia.patch('/:id', async (req, res) => {
  const idfrequencia = req.params.id;
  const { dataEntrada, dataSaida, clientes_idclientes } = req.body;

  if (isNaN(idfrequencia) || idfrequencia <= 0) {
    return res.status(400).json({ mensagem: 'ID inválido.' });
  }

  const existe = await validarExistenciaFrequencia(idfrequencia);
  if (!existe.status) {
    return res.status(404).json({ mensagem: existe.mensagem });
  }

  const validacao = await validarFrequenciaParcial({ dataEntrada, dataSaida, clientes_idclientes });
  if (!validacao.status) {
    return res.status(400).json({ mensagem: validacao.mensagem });
  }

  try {
    const resultado = await atualizaFrequenciaParcial(idfrequencia, { dataEntrada, dataSaida, clientes_idclientes });

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Frequência não encontrada ou nenhum dado atualizado.' });
    }

    res.json({ mensagem: 'Frequência atualizada com sucesso (parcial).' });
  } catch (erro) {
    console.error('Erro ao atualizar frequência (PATCH):', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor', erro: erro.message });
  }
});

/**
 * @swagger
 * /frequencia/{id}:
 *   delete:
 *     tags: [Frequência]
 *     summary: Remove uma frequência por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Frequência deletada com sucesso
 */

routerFrequencia.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ mensagem: 'ID inválido.' });
  }

  const existe = await validarExistenciaFrequencia(id);
  if (!existe.status) {
    return res.status(404).json({ mensagem: existe.mensagem });
  }

  try {
    const resultado = await deletarFrequencia(id);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Frequência não encontrada.' });
    }

    res.status(200).json({ mensagem: 'Frequência deletada com sucesso.' });
  } catch (erro) {
    console.error('Erro ao deletar frequência:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
});


export default routerFrequencia;