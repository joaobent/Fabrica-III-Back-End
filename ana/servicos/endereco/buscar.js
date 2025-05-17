import pool from '../../../conexao.js';

export async function buscarEnderecoPorFuncionarioId(id) {
  const conexao = await pool.getConnection();

  try {
    const [resultado] = await conexao.execute(
      'SELECT idendereco, cep, numeroCasa, complemento FROM endereco WHERE idendereco = ?',
      [id]
    );

    return resultado.length > 0 ? resultado[0] : null;
  } catch (erro) {
    console.error("Erro ao buscar endereço:", erro);
    throw erro;
  } finally {
    conexao.release();
  }
}


export async function buscarTodosEnderecos() {
  const conexao = await pool.getConnection();

  try {
    const [resultado] = await conexao.execute(
      'SELECT idendereco, cep,  numeroCasa, complemento FROM endereco '
    );

    return resultado;
  } catch (erro) {
    console.error("Erro ao buscar todos os endereços:", erro);
    throw erro;
  } finally {
    conexao.release();
  }
}
