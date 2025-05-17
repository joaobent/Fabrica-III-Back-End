import pool from '../../../conexao.js';


export async function deletarEndereco(id) {
  const conexao = await pool.getConnection();

  try {
    // Verifica se algum cliente está vinculado a esse endereço
    const [clientes] = await conexao.execute(
      'SELECT * FROM clientes WHERE endereco_idendereco = ?',
      [id]
    );

    if (clientes.length > 0) {
      return { bloqueado: true, origem: 'cliente' };
    }

    // Verifica se algum funcionário está vinculado a esse endereço
    const [funcionarios] = await conexao.execute(
      'SELECT * FROM funcionarios WHERE endereco_idendereco = ?',
      [id]
    );

    if (funcionarios.length > 0) {
      return { bloqueado: true, origem: 'funcionário' };
    }

    // Pode deletar
    const [resultado] = await conexao.execute(
      'DELETE FROM endereco WHERE idendereco = ?',
      [id]
    );

    return { deletado: resultado.affectedRows > 0 };
  } catch (erro) {
    console.error('Erro ao deletar endereço:', erro);
    throw erro;
  } finally {
    conexao.release();
  }
}