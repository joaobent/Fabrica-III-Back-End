import express from 'express';
const routerEndereco= express.Router();
import { buscarEnderecoPorFuncionarioId, buscarTodosEnderecos} from '../servicos/endereco/buscar.js'
import { deletarEndereco} from '../servicos/endereco/deletar.js'

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