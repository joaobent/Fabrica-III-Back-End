import express from 'express';
import multer from 'multer';
import { adicionarFormacao } from '../servicos/formacaoServicos/adicionar.js';
import { buscarFormacao } from '../servicos/formacaoServicos/buscar.js';
import { atualizaFormacao } from '../servicos/formacaoServicos/editar.js';
import { deletarFormacao } from '../servicos/formacaoServicos/deletar.js';


const routerFormacao = express.Router();
const upload = multer(); // Para lidar com arquivos (certificados)

routerFormacao.get('/', async (req, res) => {
  try {
    const formacoes = await buscarFormacao();
    res.status(200).json(formacoes);
  } catch (erro) {
    console.error('Erro ao buscar formações:', erro);
    res.status(500).json({ mensagem: 'Erro interno ao buscar formações.' });
  }
});

routerFormacao.post('/', upload.single('certificado'), async (req, res) => {
  const { formacao } = req.body;
  const certificado = req.file?.buffer;

  if (!formacao || !certificado) {
    return res.status(400).json({ mensagem: 'Dados incompletos.' });
  }

  try {
    const id = await adicionarFormacao(formacao, certificado);
    res.status(201).json({ mensagem: 'Formação cadastrada com sucesso', id });
  } catch (erro) {
    console.error('Erro ao adicionar formação:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
});

// Rota para atualizar uma formação existente
routerFormacao.put('/:id', upload.single('certificado'), async (req, res) => {
    const idformacao = req.params.id;
    const { formacao } = req.body;
    const certificado = req.file ? req.file.buffer : null;

    if (!formacao) {
        return res.status(400).json({ mensagem: 'Dados incompletos' });
    }

    try {
        const resultado = await atualizaFormacao(idformacao, formacao, certificado);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Formação não encontrada' });
        }

        res.json({ mensagem: 'Formação atualizada com sucesso' });
    } catch (erro) {
        console.error('Erro ao atualizar formação:', erro);
        res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
});

routerFormacao.delete('/:id', async (req, res) => {
    const idformacao = req.params.id;

    try {
        const resultado = await deletarFormacao(idformacao);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Formação não encontrada' });
        }

        res.json({ mensagem: 'Formação deletada com sucesso' });
    } catch (erro) {
        console.error('Erro ao deletar formação:', erro);
        res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
});

export default routerFormacao;
