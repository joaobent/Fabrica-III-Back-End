import express from 'express';
import { apresentarEquipamentos, apresentarEquipamentosPorId, apresentarEquipamentosPorNome } from '../servicos/EquipamentosServicos/buscar.js';
import { adicionarEquipamentos } from '../servicos/EquipamentosServicos/adicionar.js';
import { validarEquipamentos, validarEquipamentosParcial } from '../validacao/EquipamentosValidacao.js';
import { deletarEquipamentos } from '../servicos/EquipamentosServicos/deletar.js';
import { editarEquipamentos } from '../servicos/EquipamentosServicos/editar.js';

const routerEquipamentos = express.Router();

routerEquipamentos.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ status: 'error', mensagem: 'ID inválido' });
    }

    if (!nome) {
        return res.status(400).json({ status: 'error', mensagem: 'Nome da Equipamentos é obrigatório' });
    }

    const nomeValido = await validarEquipamentosParcial(nome);
    if (!nomeValido.status) {
        return res.status(400).json({ status: 'error', mensagem: nomeValido.mensagem });
    }

    const resultado = await editarEquipamentos(id, nome);
    if (resultado.affectedRows === 0) {
        return res.status(404).json({ status: 'error', mensagem: 'Equipamentos não encontrada' });
    }

    return res.status(200).json({ status: 'success', mensagem: 'Equipamentos editada com sucesso!' });
});

routerEquipamentos.post('/', async (req, res) => {
    const { nome } = req.body;
    if (!nome) {
        return res.status(400).json({ status: 'error', mensagem: 'Nome da Equipamentos é obrigatório.' });
    }

    const nomeValido = await validarEquipamentos(nome);
    if (!nomeValido.status) {
        return res.status(400).json({ status: 'error', mensagem: nomeValido.mensagem });
    }

    await adicionarEquipamentos(nome);
    return res.status(201).json({ status: 'success', mensagem: 'Equipamentos cadastrada com sucesso!' });
});

routerEquipamentos.get('/', async (req, res) => {
    const { nome } = req.query;

    const resultado = nome
        ? await apresentarEquipamentosPorNome(nome)
        : await apresentarEquipamentos();

    if (nome && !resultado.length) {
        return res.status(404).json({ status: 'error', mensagem: 'Equipamentos com esse nome não encontrada' });
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
        return res.status(404).json({ status: 'error', mensagem: 'Equipamentos não encontrada' });
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
        return res.status(404).json({ status: 'error', mensagem: 'Equipamentos não encontrada' });
    }

    return res.status(200).json({ status: 'success', mensagem: 'Equipamentos deletada com sucesso!' });
});

export default routerEquipamentos;
