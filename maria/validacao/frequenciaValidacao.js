
import { buscarFrequenciaPorId } from '../servicos/frequenciaServicos/buscar.js';

export async function validarFrequencia(clientes_idclientes, dataEntrada, dataSaida) {
  if (!clientes_idclientes || isNaN(clientes_idclientes)) {
    return { status: false, mensagem: 'ID do cliente é obrigatório e deve ser um número válido.' };
  }

  if (!dataEntrada || typeof dataEntrada !== 'string') {
    return { status: false, mensagem: 'Data de entrada é obrigatória e deve ser uma string válida.' };
  }

  if (!dataSaida || typeof dataSaida !== 'string') {
    return { status: false, mensagem: 'Data de saída é obrigatória e deve ser uma string válida.' };
  }

  return { status: true };
}

export async function validarFrequenciaParcial({ clientes_idclientes, dataEntrada, dataSaida }) {
  if (clientes_idclientes !== undefined && isNaN(clientes_idclientes)) {
    return { status: false, mensagem: 'ID do cliente deve ser um número válido.' };
  }

  if (dataEntrada !== undefined && typeof dataEntrada !== 'string') {
    return { status: false, mensagem: 'Data de entrada deve ser uma string válida.' };
  }

  if (dataSaida !== undefined && typeof dataSaida !== 'string') {
    return { status: false, mensagem: 'Data de saída deve ser uma string válida.' };
  }

  return { status: true };
}

export async function validarExistenciaFrequencia(idfrequencia) {
  const frequenciaExistente = await buscarFrequenciaPorId(idfrequencia);
  if (!frequenciaExistente.length) {
    return { status: false, mensagem: 'Frequência não encontrada para o ID informado.' };
  }
  return { status: true };
}

