import express from 'express';
import multer from 'multer';
import { adicionarFormacao } from '../servicos/formacaoServicos/adicionar.js';
import { buscarFormacao, buscarFormacaoPorId, buscarCertificadoPorId } from '../servicos/formacaoServicos/buscar.js';
import { atualizaFormacao } from '../servicos/formacaoServicos/editar.js';
import { deletarFormacao } from '../servicos/formacaoServicos/deletar.js';
import { atualizarFormacaoParcial } from '../servicos/formacaoServicos/editartudo.js';
import { validarFormacaoCompleta, validarExistenciaFormacao , validarFormacaoParcial} from '../validacao/formacaoValidacao.js';


const routerFormacao = express.Router();
const upload = multer(); // Para lidar com arquivos (certificados)

routerFormacao.get('/', async (req, res) => {
  // #swagger.tags = ['Formação']
// #swagger.description = 'Retorna a lista de todas as formações cadastradas, sem os certificados.'
/* #swagger.responses[200] = {
    description: 'Lista de formações retornada com sucesso.',
    schema: [
      {
        idformacao: 1,
        formacao: 'Instrutor de Crossfit'
      },
      {
        id: 32,
        formacao: 'Musculação Básica'
      }
    ]
} */
/* #swagger.responses[500] = {
    description: 'Erro interno ao buscar formações.',
    schema: { mensagem: 'Erro interno ao buscar formações.' }
} */
  try {
    const formacoes = await buscarFormacao();

    const formacoesSemCertificado = formacoes.map(f => {
      const { certificado, ...resto } = f;
      return resto;
    });

    res.status(200).json(formacoesSemCertificado);
  } catch (erro) {
    console.error('Erro ao buscar formações:', erro);
    res.status(500).json({ mensagem: 'Erro interno ao buscar formações.' });
  }
});

routerFormacao.get('/:id', async (req, res) => {
  // #swagger.tags = ['Formação']
// #swagger.description = 'Retorna a formação pelo ID, sem o certificado.'
/* #swagger.parameters['id'] = {
    description: 'ID da formação',
    type: 'integer',
    required: true
} */
/* #swagger.responses[200] = {
    description: 'Formação retornada com sucesso.',
    schema: {
        idformacao: 1,
        formacao: 'Instrutor de Crossfit'
    }
} */
/* #swagger.responses[400] = {
    description: 'ID inválido.',
    schema: { mensagem: 'ID inválido.' }
} */
/* #swagger.responses[404] = {
    description: 'Formação não encontrada.',
    schema: { mensagem: 'Formação não encontrada.' }
} */
/* #swagger.responses[500] = {
    description: 'Erro interno ao buscar formação.',
    schema: { mensagem: 'Erro interno ao buscar formação.' }
} */
  const { id } = req.params;

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ mensagem: 'ID inválido.' });
  }

  try {
    const formacao = await buscarFormacaoPorId(id);

    if (!formacao || formacao.length === 0) {
      return res.status(404).json({ mensagem: 'Formação não encontrada.' });
    }

    const formacaoSemCertificado = formacao.map(f => {
      const { certificado, ...resto } = f;
      return resto;
    });
    res.status(200).json(formacaoSemCertificado);
  } catch (erro) {
    console.error('Erro ao buscar formação por ID:', erro);
    res.status(500).json({ mensagem: 'Erro interno ao buscar formação.' });
  }
});


routerFormacao.get('/:id/certificado', async (req, res) => {
  // #swagger.tags = ['Formação']
// #swagger.description = 'Retorna o certificado da formação pelo ID.'
/* #swagger.parameters['id'] = {
    description: 'ID da formação',
    type: 'integer',
    required: true
} */
/* #swagger.responses[200] = {
    description: 'Certificado retornado com sucesso.',
    content: {
      'image/jpeg': {}
    }
} */
/* #swagger.responses[404] = {
    description: 'Certificado não encontrado.',
    schema: { erro: 'Certificado não encontrado.' }
} */
/* #swagger.responses[500] = {
    description: 'Erro ao buscar certificado.',
    schema: { erro: 'Erro ao buscar certificado.' }
} */
  const id = req.params.id;

  try {
    const formacao = await buscarCertificadoPorId(id); // nova função para buscar o certificado
    if (!formacao || !formacao.certificado) {
      return res.status(404).json({ erro: 'Certificado não encontrado.' });
    }

    res.setHeader('Content-Type', 'image/jpeg'); // ou 'image/jpeg' se for imagem
    res.send(formacao.certificado);
  } catch (erro) {
    console.error('Erro ao buscar certificado:', erro);
    res.status(500).json({ erro: 'Erro ao buscar certificado.' });
  }
});

routerFormacao.post('/', upload.single('certificado'), async (req, res) => {
  // #swagger.tags = ['Formação']
// #swagger.description = 'Cadastra uma nova formação com certificado (upload do arquivo).'
// #swagger.consumes = ['multipart/form-data']
/* #swagger.parameters['formacao'] = { 
    in: 'formData',
    type: 'string',
    description: 'Dados da formação em formato JSON',
    required: true
} */
/* #swagger.parameters['certificado'] = { 
    in: 'formData',
    type: 'file',
    description: 'Arquivo do certificado',
    required: true
} */
/* #swagger.responses[201] = {
    description: 'Formação cadastrada com sucesso.',
    schema: { mensagem: 'Formação cadastrada com sucesso', id: 1 }
} */
/* #swagger.responses[400] = {
    description: 'Dados incompletos.',
    schema: { mensagem: 'Dados incompletos.' }
} */
/* #swagger.responses[500] = {
    description: 'Erro interno no servidor.',
    schema: { mensagem: 'Erro interno no servidor.' }
} */
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
  // #swagger.tags = ['Formação']
// #swagger.description = 'Atualiza completamente uma formação pelo ID (dados + certificado opcional).'
// #swagger.consumes = ['multipart/form-data']
/* #swagger.parameters['id'] = { description: 'ID da formação' } */
/* #swagger.parameters['formacao'] = { 
    in: 'formData',
    type: 'string',
    description: 'Dados da formação em formato JSON',
    required: true
} */
/* #swagger.parameters['certificado'] = { 
    in: 'formData',
    type: 'file',
    description: 'Arquivo do certificado (opcional)',
    required: false
} */
/* #swagger.responses[200] = {
    description: 'Formação atualizada com sucesso.',
    schema: { mensagem: 'Formação atualizada com sucesso' }
} */
/* #swagger.responses[400] = {
    description: 'ID inválido ou dados incompletos.',
    schema: { mensagem: 'ID inválido.' }
} */
/* #swagger.responses[404] = {
    description: 'Formação não encontrada para atualizar.',
    schema: { mensagem: 'Formação não encontrada para atualizar' }
} */
/* #swagger.responses[500] = {
    description: 'Erro interno no servidor.',
    schema: { mensagem: 'Erro interno no servidor' }
} */

    const idformacao = req.params.id;
    const { formacao } = req.body;
    const certificado = req.file ? req.file.buffer : null;

     if (isNaN(idformacao) || idformacao <= 0) {
    return res.status(400).json({ mensagem: 'ID inválido.' });
  }

  const existe = await validarExistenciaFormacao(idformacao);
  if (!existe.status) {
    return res.status(404).json({ mensagem: existe.mensagem });
  }

  const validacao = await validarFormacaoCompleta(certificado, formacao);
  if (!validacao.status) {
    return res.status(400).json({ mensagem: validacao.mensagem });
  }

    if (!formacao) {
        return res.status(400).json({ mensagem: 'Dados incompletos' });
    }

    try {
        const resultado = await atualizaFormacao(idformacao, formacao, certificado);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Formação não encontrada para atualizar' });
        }

        res.json({ mensagem: 'Formação atualizada com sucesso' });
    } catch (erro) {
        console.error('Erro ao atualizar formação:', erro);
        res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
});

routerFormacao.patch('/:id', async (req, res) => {
  // #swagger.tags = ['Formação']
// #swagger.description = 'Atualiza parcialmente uma formação pelo ID (pode enviar dados ou certificado).'
// #swagger.consumes = ['application/json']
/* #swagger.parameters['id'] = { description: 'ID da formação' } */
/* #swagger.parameters['dados'] = {
    in: 'body',
    description: 'Campos para atualização parcial (formacao e/ou certificado em base64, dependendo da implementação)',
    schema: {
      type: 'object',
      properties: {
        formacao: { type: 'string' },
        certificado: { type: 'string' }
      }
    },
    required: true
} */
/* #swagger.responses[200] = {
    description: 'Formação atualizada parcialmente com sucesso.',
    schema: { mensagem: 'Formação atualizada parcialmente com sucesso.' }
} */
/* #swagger.responses[400] = {
    description: 'ID inválido ou dados inválidos.',
    schema: { mensagem: 'ID inválido.' }
} */
/* #swagger.responses[404] = {
    description: 'Formação não encontrada.',
    schema: { mensagem: 'Formação não encontrada.' }
} */
/* #swagger.responses[500] = {
    description: 'Erro interno no servidor.',
    schema: { mensagem: 'Erro interno no servidor.' }
} */
  const { id } = req.params;
  const  dados = req.body;

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ mensagem: 'ID inválido.' });
  }

  // Verifica se o registro existe
  const existe = await validarExistenciaFormacao(id);
  if (!existe.status) {
    return res.status(404).json({ mensagem: existe.mensagem });
  }

  if (!dados.certificado && !dados.formacao) {
    return res.status(400).json({ mensagem: 'Informe pelo menos um campo para atualizar.' });
  }

  // Validação dos dados enviados parcialmente
  const validacao = await validarFormacaoParcial(dados);
  if (!validacao.status) {
    return res.status(400).json({ mensagem: validacao.mensagem });
  }

  try {
    const resultado = await atualizarFormacaoParcial(id, dados);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Formação não atualizada.' });
    }

    res.status(200).json({ mensagem: 'Formação atualizada parcialmente com sucesso.' });
  } catch (erro) {
    console.error('Erro ao atualizar parcialmente a formação:', erro);
    res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
});


routerFormacao.delete('/:id', async (req, res) => {
  // #swagger.tags = ['Formação']
// #swagger.description = 'Deleta uma formação pelo ID.'
/* #swagger.parameters['id'] = { description: 'ID da formação' } */
/* #swagger.responses[200] = {
    description: 'Formação deletada com sucesso.',
    schema: { mensagem: 'Formação deletada com sucesso' }
} */
/* #swagger.responses[404] = {
    description: 'Formação não encontrada.',
    schema: { mensagem: 'Formação não encontrada' }
} */
/* #swagger.responses[500] = {
    description: 'Erro interno no servidor.',
    schema: { mensagem: 'Erro interno no servidor' }
} */
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
