import express from 'express';
import multer from 'multer';
import { adicionarFormacao } from '../servicos/formacaoServicos/adicionar.js';
import { buscarFormacao } from '../servicos/formacaoServicos/buscar.js';


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

export default routerFormacao;
