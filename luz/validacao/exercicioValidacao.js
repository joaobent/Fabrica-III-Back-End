import { retornaClientePorId } from '../../sofia/servico/buscar.js';
import { retornaFuncionarioPorid } from '../../ana/servicos/funcionariosServicos/buscar.js';
import { apresentarEquipamentosPorId } from '../../anne/servicos/equipamentoServicos/buscar.js';
import { apresentarMarcaPorId } from '../../anne/servicos/marcaServicos/buscar.js';
import pool from '../../conexao.js';

/* ---------- utilitário ---------- */
async function executarQuery(sql, params = []) {
  let conexao;
  try {
    conexao = await pool.getConnection();
    const [resultado] = await conexao.execute(sql, params);
    return resultado;
  } finally {
    if (conexao) conexao.release();
  }
}

async function validarExercicio(
  quatDeSeries,
  quantDeRepeticoes,
  diaDaSemana,
  parteDoCorpo,
  clientes_idclientes,
  funcionarios_idfuncionarios,
  funcionarios_formacao_idformacao,
  equipamentos_idequipamentos,
  equipamentos_marca_idmarca
) {
  if (!quatDeSeries || isNaN(quatDeSeries)) {
    return { status: false, mensagem: 'A quantidade de séries é obrigatória e deve ser um número válido.' };
  }

  if (!quantDeRepeticoes || isNaN(quantDeRepeticoes)) {
    return { status: false, mensagem: 'A quantidade de repetições é obrigatória e deve ser um número válido.' };
  }

  if (diaDaSemana === undefined || isNaN(diaDaSemana) || diaDaSemana < 1 || diaDaSemana > 7) {
    return { status: false, mensagem: 'O dia da semana deve ser um número entre 1 e 7.' };
  }

  if (!parteDoCorpo || typeof parteDoCorpo !== 'string' || parteDoCorpo.trim() === '') {
    return { status: false, mensagem: 'Parte do corpo é obrigatória e deve ser uma string válida.' };
  }

  if (!clientes_idclientes || isNaN(clientes_idclientes)) {
    return { status: false, mensagem: 'ID do cliente é obrigatório e deve ser um número válido.' };
  }

  const clienteExiste = await retornaClientePorId(clientes_idclientes);
  if (!clienteExiste.length) {
    return { status: false, mensagem: `Cliente com ID ${clientes_idclientes} não existe.` };
  }

  if (!funcionarios_idfuncionarios || isNaN(funcionarios_idfuncionarios)) {
    return { status: false, mensagem: 'ID do funcionário é obrigatório e deve ser um número válido.' };
  }

  const funcionarioExiste = await retornaFuncionarioPorid(funcionarios_idfuncionarios);
  if (!funcionarioExiste.length) {
    return { status: false, mensagem: `Funcionário com ID ${funcionarios_idfuncionarios} não existe.` };
  }

  if (!funcionarios_formacao_idformacao || isNaN(funcionarios_formacao_idformacao)) {
    return { status: false, mensagem: 'ID da formação do funcionário é obrigatório e deve ser um número válido.' };
  }

  if (!equipamentos_idequipamentos || isNaN(equipamentos_idequipamentos)) {
    return { status: false, mensagem: 'ID do equipamento é obrigatório e deve ser um número válido.' };
  }

  const equipamentoExiste = await apresentarEquipamentosPorId(equipamentos_idequipamentos);
  if (!equipamentoExiste.length) {
    return { status: false, mensagem: `Equipamento com ID ${equipamentos_idequipamentos} não existe.` };
  }

  if (!equipamentos_marca_idmarca || isNaN(equipamentos_marca_idmarca)) {
    return { status: false, mensagem: 'ID da marca do equipamento é obrigatório e deve ser um número válido.' };
  }

  const marcaExiste = await apresentarMarcaPorId(equipamentos_marca_idmarca);
  if (!marcaExiste.length) {
    return { status: false, mensagem: `Marca com ID ${equipamentos_marca_idmarca} não existe.` };
  }

  return { status: true };
}

async function validarExercicioParcial(dados) {
  const {
    quatDeSeries,
    quantDeRepeticoes,
    diaDaSemana,
    parteDoCorpo,
    clientes_idclientes,
    funcionarios_idfuncionarios,
    funcionarios_formacao_idformacao,
    equipamentos_idequipamentos,
    equipamentos_marca_idmarca
  } = dados;

  if (quatDeSeries !== undefined && isNaN(quatDeSeries)) {
    return { status: false, mensagem: 'A quantidade de séries deve ser um número válido.' };
  }

  if (quantDeRepeticoes !== undefined && isNaN(quantDeRepeticoes)) {
    return { status: false, mensagem: 'A quantidade de repetições deve ser um número válido.' };
  }

  if (diaDaSemana !== undefined && (isNaN(diaDaSemana) || diaDaSemana < 1 || diaDaSemana > 7)) {
    return { status: false, mensagem: 'O dia da semana deve ser um número entre 1 e 7.' };
  }

  if (parteDoCorpo !== undefined && (typeof parteDoCorpo !== 'string' || parteDoCorpo.trim() === '')) {
    return { status: false, mensagem: 'A parte do corpo deve ser uma string válida.' };
  }

  if (clientes_idclientes !== undefined) {
    if (isNaN(clientes_idclientes)) {
      return { status: false, mensagem: 'O ID do cliente deve ser um número válido.' };
    }

    const clienteExiste = await retornaClientePorId(clientes_idclientes);
    if (!clienteExiste.length) {
      return { status: false, mensagem: `Cliente com ID ${clientes_idclientes} não existe.` };
    }
  }

  if (funcionarios_idfuncionarios !== undefined) {
    if (isNaN(funcionarios_idfuncionarios)) {
      return { status: false, mensagem: 'O ID do funcionário deve ser um número válido.' };
    }

    const funcionarioExiste = await retornaFuncionarioPorid(funcionarios_idfuncionarios);
    if (!funcionarioExiste.length) {
      return { status: false, mensagem: `Funcionário com ID ${funcionarios_idfuncionarios} não existe.` };
    }
  }

  if (funcionarios_formacao_idformacao !== undefined && isNaN(funcionarios_formacao_idformacao)) {
    return { status: false, mensagem: 'O ID da formação do funcionário deve ser um número válido.' };
  }

  if (equipamentos_idequipamentos !== undefined) {
    if (isNaN(equipamentos_idequipamentos)) {
      return { status: false, mensagem: 'O ID do equipamento deve ser um número válido.' };
    }

    const equipamentoExiste = await apresentarEquipamentosPorId(equipamentos_idequipamentos);
    if (!equipamentoExiste.length) {
      return { status: false, mensagem: `Equipamento com ID ${equipamentos_idequipamentos} não existe.` };
    }
  }

  if (equipamentos_marca_idmarca !== undefined) {
    if (isNaN(equipamentos_marca_idmarca)) {
      return { status: false, mensagem: 'O ID da marca deve ser um número válido.' };
    }

    const marcaExiste = await apresentarMarcaPorId(equipamentos_marca_idmarca);
    if (!marcaExiste.length) {
      return { status: false, mensagem: `Marca com ID ${equipamentos_marca_idmarca} não existe.` };
    }
  }

  return { status: true };
}

async function validarFuncionarioComFormacao(idFuncionario, idFormacao) {
  const sql = `
    SELECT 1 FROM funcionarios
    WHERE idfuncionarios = ? AND formacao_idformacao = ?
    LIMIT 1
  `;
  const resultado = await executarQuery(sql, [idFuncionario, idFormacao]);
  return resultado.length > 0;
}


export { validarExercicio, validarExercicioParcial, validarFuncionarioComFormacao };
