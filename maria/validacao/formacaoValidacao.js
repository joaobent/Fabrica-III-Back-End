import { buscarFormacaoPorId } from '../servicos/formacaoServicos/buscar.js';

export async function validarFormacaoCompleta(dados) {
  if (!dados || typeof dados !== 'string') {
    return { status: false, mensagem: 'Formação é obrigatória e deve ser uma string válida.' };
  }

  if (!dados || typeof dados !== 'string') {
    return { status: false, mensagem: 'Certificado é obrigatório e deve ser uma string válida.' };
  }

  return { status: true };
}

export async function validarFormacaoParcial(dados) {
  const { certificado, formacao } = dados;
  if (certificado !== undefined && typeof certificado !== 'string') {
    return { status: false, mensagem: 'Formação deve ser uma string válida.' };
  }

  if (formacao !== undefined && typeof formacao !== 'string') {
    return { status: false, mensagem: 'Certificado deve ser uma string válida.' };
  }

  return { status: true };
}

export async function validarExistenciaFormacao(idformacao) {
  const formacao = await buscarFormacaoPorId(idformacao);

  if (!formacao || formacao.length === 0) {
    return { status: false, mensagem: 'Formação não encontrada para o ID informado.' };
  }

  return { status: true };
}
