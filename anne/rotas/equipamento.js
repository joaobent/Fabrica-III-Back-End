import express from 'express';
import { apresentarEquipamentos, apresentarEquipamentosPorId, apresentarEquipamentosPorNome, apresentarEquipamentosPorIdMarca } from '../servicos/equipamentoServicos/buscar.js';
import { adicionarEquipamentos } from '../servicos/equipamentoServicos/adicionar.js';
import { validarEquipamentos, validarEquipamentosParcial } from '../validacao/equipamentoValidacao.js';
import { deletarEquipamentos } from '../servicos/equipamentoServicos/deletar.js';
import { editarEquipamentos } from '../servicos/equipamentoServicos/editar.js';

const routerEquipamentos = express.Router();

routerEquipamentos.put('/:id', async (req, res) => {
    // #swagger.tags = ['Equipamentos']
// #swagger.description = 'Atualiza apenas o nome de um equipamento pelo ID.'
// #swagger.parameters['id'] = {
//   in: 'path',
//   description: 'ID do equipamento a ser editado.',
//   required: true,
//   type: 'integer',
//   example: 2
// }
// #swagger.parameters['body'] = {
//   in: 'body',
//   description: 'Novo nome do equipamento.',
//   required: true,
//   schema: {
//     nome: 'Esteira Elétrica Pro'
//   }
// }
/* #swagger.responses[200] = {
    description: 'Equipamento atualizado com sucesso.',
    schema: { mensagem: 'Equipamentos editada com sucesso!' }
} */
/* #swagger.responses[400] = {
    description: 'Erro de validação.',
    schema: { mensagem: 'ID inválido ou nome inválido.' }
} */
/* #swagger.responses[404] = {
    description: 'Equipamento não encontrado.',
    schema: { mensagem: 'Equipamentos não encontrado' }
} */
    const { id } = req.params;
    const { nome } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ status: 'error', mensagem: 'ID inválido' });
    }

    if (!nome) {
        return res.status(400).json({ status: 'error', mensagem: 'Nome do equipamento é obrigatório' });
    }

    const nomeValido = await validarEquipamentosParcial(nome);
    if (!nomeValido.status) {
        return res.status(400).json({ status: 'error', mensagem: nomeValido.mensagem });
    }

    const resultado = await editarEquipamentos(id, nome);
    if (resultado.affectedRows === 0) {
        return res.status(404).json({ status: 'error', mensagem: 'Equipamentos não encontrado' });
    }

    return res.status(200).json({ status: 'success', mensagem: 'Equipamentos editada com sucesso!' });
});

routerEquipamentos.patch('/:id', async (req, res) => {
    // #swagger.tags = ['Equipamentos']
// #swagger.description = 'Atualiza parcialmente os dados de um equipamento.'
// #swagger.parameters['id'] = {
//   in: 'path',
//   description: 'ID do equipamento.',
//   required: true,
//   type: 'integer',
//   example: 1
// }
// #swagger.parameters['body'] = {
//   in: 'body',
//   description: 'Campos que podem ser atualizados.',
//   required: true,
//   schema: {
//     nome: 'Bicicleta Ergométrica Pro',
//     tipo: 'Cardio',
//     numeroDIncricao: 'INSCR123',
//     descricao: 'Aparelho para treino cardiovascular',
//     marca_idmarca: 4
//   }
// }
/* #swagger.responses[200] = {
    description: 'Equipamento atualizado com sucesso.',
    schema: { mensagem: 'Equipamento atualizado com sucesso!' }
} */
/* #swagger.responses[400] = {
    description: 'Dados inválidos.',
    schema: { mensagem: 'ID inválido ou nenhum dado fornecido para atualização.' }
} */
/* #swagger.responses[404] = {
    description: 'Equipamento não encontrado.',
    schema: { mensagem: 'Equipamento não encontrado' }
} */
    const { id } = req.params;
    const { nome, tipo, numeroDIncricao, descricao, marca_idmarca } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ status: 'error', mensagem: 'ID inválido' });
    }

    const camposAtualizar = {};
    if (nome) camposAtualizar.nome_modelo = nome;
    if (tipo) camposAtualizar.tipo = tipo;
    if (numeroDIncricao) camposAtualizar.numeroDIncricao = numeroDIncricao;
    if (descricao) camposAtualizar.descricao = descricao;
    if (marca_idmarca) camposAtualizar.marca_idmarca = marca_idmarca;

    if (Object.keys(camposAtualizar).length === 0) {
        return res.status(400).json({ status: 'error', mensagem: 'Nenhum dado fornecido para atualização' });
    }

    const modeloValido = await validarEquipamentosParcial(nome, tipo, numeroDIncricao, descricao, marca_idmarca);
    if (!modeloValido.status) {
        return res.status(400).json({ status: 'error', mensagem: modeloValido.mensagem });
    }

    const resultado = await editarEquipamentos(id, camposAtualizar);
    if (resultado.affectedRows === 0) {
        return res.status(404).json({ status: 'error', mensagem: 'Equipamento não encontrado' });
    }

    return res.status(200).json({ status: 'success', mensagem: 'Equipamento atualizado com sucesso!' });
});


routerEquipamentos.post('/', async (req, res) => {
    // #swagger.tags = ['Equipamentos']
// #swagger.description = 'Cadastra um novo equipamento.'
// #swagger.parameters['body'] = {
//   in: 'body',
//   description: 'Dados do novo equipamento.',
//   required: true,
//   schema: {
//     nome: 'Cadeira Extensora',
//     tipo: 'Musculação',
//     numeroDeInscricao: 'EQP456',
//     descricao: 'Equipamento para exercícios de perna',
//     marca_idmarca: 2
//   }
// }
/* #swagger.responses[201] = {
    description: 'Equipamento cadastrado com sucesso.',
    schema: { mensagem: 'Equipamento cadastrado com sucesso!' }
} */
/* #swagger.responses[400] = {
    description: 'Erro de validação.',
    schema: { mensagem: 'Todos os campos são obrigatórios.' }
} */
/* #swagger.responses[500] = {
    description: 'Erro interno do servidor.',
    schema: { mensagem: 'Erro interno do servidor.' }
} */
    const { nome, tipo, numeroDeInscricao, descricao, marca_idmarca } = req.body;

    if (!nome || !tipo || !numeroDeInscricao || !descricao || !marca_idmarca) {
        return res.status(400).json({ status: 'error', mensagem: 'Todos os campos são obrigatórios.' });
    }

    try {
        const resultadoValidacao = await validarEquipamentos(nome, tipo, numeroDeInscricao, descricao, marca_idmarca);
        if (!resultadoValidacao.status) {
            return res.status(400).json({ status: 'error', mensagem: resultadoValidacao.mensagem });
        }

        await adicionarEquipamentos(nome, tipo, numeroDeInscricao, descricao, marca_idmarca);
        return res.status(201).json({ status: 'success', mensagem: 'Equipamento cadastrado com sucesso!' });
    } catch (erro) {
        console.error('Erro ao cadastrar equipamento:', erro);
        return res.status(500).json({ status: 'error', mensagem: 'Erro interno do servidor.' });
    }
});


routerEquipamentos.get('/', async (req, res) => {
    // #swagger.tags = ['Equipamentos']
// #swagger.description = 'Lista todos os equipamentos ou filtra por nome.'
// #swagger.parameters['nome'] = {
//   in: 'query',
//   description: 'Nome do equipamento para busca.',
//   required: false,
//   type: 'string',
//   example: 'Esteira'
// }
/* #swagger.responses[200] = {
    description: 'Lista de equipamentos encontrada.',
    schema: {
      dados: [
        {
          id: 1,
          nome_modelo: 'Esteira Elétrica Pro',
          tipo: 'Cardio',
          descricao: 'Para corrida',
          marca_idmarca: 3
        }
      ]
    }
} */
/* #swagger.responses[404] = {
    description: 'Nenhum equipamento encontrado com esse nome.',
    schema: { mensagem: 'Equipamento com esse nome não encontrado' }
} */
    const { nome } = req.query;

    const resultado = nome
        ? await apresentarEquipamentosPorNome(nome)
        : await apresentarEquipamentos();

    if (nome && !resultado.length) {
        return res.status(404).json({ status: 'error', mensagem: 'Equipamento com esse nome não encontrado' });
    }

    return res.status(200).json({ status: 'success', dados: resultado });
});

routerEquipamentos.get('/:id', async (req, res) => {
    // #swagger.tags = ['Equipamentos']
// #swagger.description = 'Busca um equipamento pelo ID.'
// #swagger.parameters['id'] = {
//   in: 'path',
//   description: 'ID do equipamento.',
//   required: true,
//   type: 'integer',
//   example: 5
// }
/* #swagger.responses[200] = {
    description: 'Equipamento encontrado.',
    schema: {
      dados: [
        {
          id: 5,
          nome_modelo: 'Leg Press',
          tipo: 'Musculação',
          descricao: 'Exercício para pernas',
          marca_idmarca: 1
        }
      ]
    }
} */
/* #swagger.responses[400] = {
    description: 'ID inválido.',
    schema: { mensagem: 'ID inválido' }
} */
/* #swagger.responses[404] = {
    description: 'Equipamento não encontrado.',
    schema: { mensagem: 'Equipamento não encontrado' }
} */
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ status: 'error', mensagem: 'ID inválido' });
    }

    const resultado = await apresentarEquipamentosPorId(id);
    if (!resultado.length) {
        return res.status(404).json({ status: 'error', mensagem: 'Equipamento não encontrado' });
    }

    return res.status(200).json({ status: 'success', dados: resultado });
});

routerEquipamentos.delete('/:id', async (req, res) => {
    // #swagger.tags = ['Equipamentos']
// #swagger.description = 'Remove um equipamento pelo ID.'
// #swagger.parameters['id'] = {
//   in: 'path',
//   description: 'ID do equipamento a ser deletado.',
//   required: true,
//   type: 'integer',
//   example: 3
// }
/* #swagger.responses[200] = {
    description: 'Equipamento deletado com sucesso.',
    schema: { mensagem: 'Equipamento deletado com sucesso!' }
} */
/* #swagger.responses[400] = {
    description: 'ID inválido.',
    schema: { mensagem: 'ID inválido' }
} */
/* #swagger.responses[404] = {
    description: 'Equipamento não encontrado.',
    schema: { mensagem: 'Equipamento não encontrado' }
} */
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ status: 'error', mensagem: 'ID inválido' });
    }

    const resultado = await deletarEquipamentos(id);
    if (resultado.affectedRows === 0) {
        return res.status(404).json({ status: 'error', mensagem: 'Equipamento não encontrado' });
    }

    return res.status(200).json({ status: 'success', mensagem: 'Equipamento deletado com sucesso!' });
});

export default routerEquipamentos;
