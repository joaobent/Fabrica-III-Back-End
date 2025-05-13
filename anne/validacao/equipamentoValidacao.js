import { apresentarEquipamentoPorNome } from '../servicos/equipamentoServicos/buscar.js';

async function validarequipamento(valor) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    return {
      status: false,
      mensagem: 'Valor inválido. Deve ser uma string não vazia.',
    };
  }

  const equipamentoExistente = await apresentarEquipamentoPorNome(valor);
  if (equipamentoExistente.length != 0) {
    return {
      status: false,
      mensagem: `O equipamento "${valor}" já está cadastrado.`,
    };
  }

  return { status: true, mensagem: '' };
}

async function validarequipamentoParcial(valor) {
  if (typeof valor !== 'string' || valor.trim() === '') {
    return {
      status: false,
      mensagem: 'Valor inválido. Deve ser uma string não vazia.',
    };
  }

  return { status: true, mensagem: '' };
}

export { validarequipamento, validarequipamentoParcial }