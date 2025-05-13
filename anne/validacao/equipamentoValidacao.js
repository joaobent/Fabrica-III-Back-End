import { apresentarEquipamentosPorNome } from '../servicos/equipamentoServicos/buscar.js';
import { apresentarMarcaPorId } from '../servicos/marcaServicos/buscar.js';

async function validarEquipamentos(nome, tipo, numeroDIncricao, descricao, marca_idmarca) {
  if (!nome || typeof nome !== 'string' || nome.trim() === '') {
    return { status: false, mensagem: 'Nome do equipamento é obrigatório e deve ser uma string válida.' };
  }

  const equipamentoExistente = await apresentarEquipamentosPorNome(nome);
  if (equipamentoExistente.length > 0) {
    return { status: false, mensagem: `O equipamento "${nome}" já está cadastrado.` };
  }

  if (!tipo || typeof tipo !== 'string') {
    return { status: false, mensagem: 'Tipo do equipamento é obrigatório e deve ser uma string.' };
  }

  if (!numeroDIncricao || typeof numeroDIncricao !== 'string') {
    return { status: false, mensagem: 'Número de inscrição é obrigatório e deve ser uma string.' };
  }

  if (!descricao || typeof descricao !== 'string') {
    return { status: false, mensagem: 'Descrição é obrigatória e deve ser uma string.' };
  }

  const marcaExiste = await apresentarMarcaPorId(marca_idmarca);
  if (!marcaExiste.length) {
    return { status: false, mensagem: `A marca com ID ${marca_idmarca} não existe.` };
  }

  return { status: true };
}

async function validarEquipamentosParcial(nome, tipo, numeroDIncricao, descricao, marca_idmarca) {
  if (nome && (typeof nome !== 'string' || nome.trim() === '')) {
    return { status: false, mensagem: 'O nome deve ser uma string válida.' };
  }

  if (tipo && typeof tipo !== 'string') {
    return { status: false, mensagem: 'O tipo deve ser uma string.' };
  }

  if (numeroDIncricao && typeof numeroDIncricao !== 'string') {
    return { status: false, mensagem: 'O número de inscrição deve ser uma string.' };
  }

  if (descricao && typeof descricao !== 'string') {
    return { status: false, mensagem: 'A descrição deve ser uma string.' };
  }

  if (marca_idmarca) {
    const marcaExiste = await apresentarMarcaPorId(marca_idmarca);
    if (!marcaExiste.length) {
      return { status: false, mensagem: `A marca com ID ${marca_idmarca} não existe.` };
    }
  }

  return { status: true };
}

export { validarEquipamentos, validarEquipamentosParcial };
