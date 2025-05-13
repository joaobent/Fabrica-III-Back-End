import express from 'express';
import { apresentarEquipamentos, apresentarEquipamentosPorId, apresentarEquipamentosPorNome, apresentarEquipamentosPorIdMarca } from '../servicos/equipamentoServicos/buscar.js';
import { adicionarEquipamentos } from '../servicos/equipamentoServicos/adicionar.js';
import { validarEquipamentos, validarEquipamentosParcial } from '../validacao/equipamentoValidacao.js';
import { deletarEquipamentos } from '../servicos/equipamentoServicos/deletar.js';
import { editarEquipamentos } from '../servicos/equipamentoServicos/editar.js';

const routerEquipamentos = express.Router();

routerEquipamentos.put('/:id', async (req, res) => {
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
    const { nome, tipo, numeroDIncricao, descricao, marca_idmarca } = req.body;
    if (!nome || !tipo || !numeroDIncricao || !descricao || !marca_idmarca) {
        return res.status(400).json({ status: 'error', mensagem: 'Nome da equipamento é obrigatório.' });
    }

    const nomeValido = await validarEquipamentos(nome, tipo, numeroDIncricao, descricao, marca_idmarca);
    if (!nomeValido.status) {
        return res.status(400).json({ status: 'error', mensagem: nomeValido.mensagem });
    }

    await adicionarEquipamentos(nome, tipo, numeroDIncricao, descricao, marca_idmarca);
    return res.status(201).json({ status: 'success', mensagem: 'Equipamento cadastrado com sucesso!' });
});

routerEquipamentos.get('/', async (req, res) => {
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
