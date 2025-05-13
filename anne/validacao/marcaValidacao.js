import { apresentarMarcaPorNome } from '../servicos/marcaServicos/buscar.js';

async function validarMarca(valor) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    return {
      status: false,
      mensagem: 'Valor inválido. Deve ser uma string não vazia.',
    };
  }

  const marcaExistente = await apresentarMarcaPorNome(valor);
  console.log(marcaExistente.length)
  if (marcaExistente.length != 0) {
    return {
      status: false,
      mensagem: `O marca "${valor}" já está cadastrado.`,
    };
  }

  return { status: true, mensagem: '' };
}

async function validarMarcaParcial(valor) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    return {
      status: false,
      mensagem: 'Valor inválido. Deve ser uma string não vazia.',
    };
  }

  return { status: true, mensagem: '' };
}

export { validarMarca, validarMarcaParcial }