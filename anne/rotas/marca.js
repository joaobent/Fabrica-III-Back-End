import express from 'express';
import { apresentarMarca, apresentarMarcaPorId, apresentarMarcaPorNome } from '../servicos/marcaServicos/buscar.js';
import { adicionarMarca } from '../servicos/marcaServicos/adicionar.js';
import { validarMarca, validarMarcaParcial } from '../validacao/marcaValidacao.js';
import { deletarMarca } from '../servicos/marcaServicos/deletar.js';
import { editarMarca } from '../servicos/marcaServicos/editar.js';

const routerMarca = express.Router();

routerMarca.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ status: 'error', mensagem: 'ID inválido' });
    }

    if (!nome) {
        return res.status(400).json({ status: 'error', mensagem: 'Nome da marca é obrigatório' });
    }

    const nomeValido = await validarMarcaParcial(nome);
    if (!nomeValido.status) {
        return res.status(400).json({ status: 'error', mensagem: nomeValido.mensagem });
    }

    const resultado = await editarMarca(id, nome);
    if (resultado.affectedRows === 0) {
        return res.status(404).json({ status: 'error', mensagem: 'Marca não encontrada' });
    }

    return res.status(200).json({ status: 'success', mensagem: 'Marca editada com sucesso!' });
});

routerMarca.post('/', async (req, res) => {
    const { nome } = req.body;
    console.log(nome)
    if (!nome) {
        return res.status(400).json({ status: 'error', mensagem: 'Nome da marca é obrigatório.' });
    }

    const nomeValido = await validarMarca(nome);
    if (!nomeValido.status) {
        return res.status(400).json({ status: 'error', mensagem: nomeValido.mensagem });
    }

    await adicionarMarca(nome);
    return res.status(201).json({ status: 'success', mensagem: 'Marca cadastrada com sucesso!' });
});

routerMarca.get('/', async (req, res) => {
    const { nome } = req.query;

    const resultado = nome
        ? await apresentarMarcaPorNome(nome)
        : await apresentarMarca();

    if (nome && !resultado.length) {
        return res.status(404).json({ status: 'error', mensagem: 'Marca com esse nome não encontrada' });
    }

    return res.status(200).json({ status: 'success', dados: resultado });
});

routerMarca.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ status: 'error', mensagem: 'ID inválido' });
    }

    const resultado = await apresentarMarcaPorId(id);
    if (!resultado.length) {
        return res.status(404).json({ status: 'error', mensagem: 'Marca não encontrada' });
    }

    return res.status(200).json({ status: 'success', dados: resultado });
});

routerMarca.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ status: 'error', mensagem: 'ID inválido' });
    }

    const resultado = await deletarMarca(id);
    if (resultado.affectedRows === 0) {
        return res.status(404).json({ status: 'error', mensagem: 'Marca não encontrada' });
    }

    return res.status(200).json({ status: 'success', mensagem: 'Marca deletada com sucesso!' });
});

export default routerMarca;
