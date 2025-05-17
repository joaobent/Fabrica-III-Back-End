import pool from "../../../conexao.js";

export async function executaQuery(conexao, query, params) {
  const [rows] = await conexao.execute(query, params);
  return rows;
}

export async function retornaFuncionarios() {
    const conexao = await pool.getConnection();
    const query = `
        SELECT 
            funcionarios.idfuncionarios,
            funcionarios.nome,
            funcionarios.senha,
            funcionarios.cpf,
            funcionarios.dataDeNascimento,
            funcionarios.email,
            funcionarios.telefone,
            formacao.formacao AS nomeFormacao,
            endereco.cep,
            endereco.numeroCasa,
            endereco.complemento
        FROM funcionarios 
        INNER JOIN formacao ON funcionarios.formacao_idformacao = formacao.idformacao
        INNER JOIN endereco ON funcionarios.endereco_idendereco = endereco.idendereco
        ORDER BY funcionarios.idfuncionarios
    `;
    const resultado = await executaQuery(conexao, query);
    conexao.release();
    return resultado;
}

export async function retornaFuncionariosPorNome(nome) {
    const conexao = await pool.getConnection();
    const query =`
    SELECT 
      funcionarios.idfuncionarios,
      funcionarios.nome,
      funcionarios.senha,
      funcionarios.cpf,
      funcionarios.dataDeNascimento,
      funcionarios.email,
      funcionarios.telefone,
      formacao.formacao AS nomeFormacao,
      endereco.cep,
      endereco.numeroCasa,
      endereco.complemento   
    FROM funcionarios 
    INNER JOIN formacao ON funcionarios.formacao_idformacao = formacao.idformacao
    INNER JOIN endereco ON funcionarios.endereco_idendereco = endereco.idendereco
    WHERE funcionarios.nome LIKE ?
  `; 
    const resultado = await executaQuery(conexao, query,[`%${nome}%`]);
    conexao.release();
    return resultado;
}

export async function retornaFuncionarioPorid(id) {
  const conexao = await pool.getConnection();
  const query = `
    SELECT 
      funcionarios.idfuncionarios,
      funcionarios.nome,
      funcionarios.senha,
      funcionarios.cpf,
      funcionarios.dataDeNascimento,
      funcionarios.email,
      funcionarios.telefone,
      formacao.formacao AS nomeFormacao,
      endereco.cep,
      endereco.numeroCasa,
      endereco.complemento   
    FROM funcionarios 
    INNER JOIN formacao ON funcionarios.formacao_idformacao = formacao.idformacao
    INNER JOIN endereco ON funcionarios.endereco_idendereco = endereco.idendereco
    WHERE funcionarios.idfuncionarios = ?
  `;
  const resultado = await executaQuery(conexao, query, [id]);
  conexao.release();
  return resultado;
}


export async function buscarFotoPerfilPorId(id) {
  const conexao = await pool.getConnection();
  try {
    const [resultado] = await conexao.execute(
      'SELECT fotoPerfil FROM funcionarios WHERE idfuncionarios = ?',
      [id]
    );
    return resultado.length > 0 ? resultado[0] : null;
  } finally {
    conexao.release();
  }
}
