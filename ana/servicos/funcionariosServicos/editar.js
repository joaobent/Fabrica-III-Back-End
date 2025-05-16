import pool from "../../../conexao.js";

export async function executaQuery(conexao, query, params) {
  const [rows] = await conexao.execute(query, params);
  return rows;
}




export async function atualizarFuncionario(id, dados) {
  const conexao = await pool.getConnection();

  const query = `
    UPDATE funcionarios SET 
      nome = ?, 
      senha = ?, 
      cpf = ?, 
      dataDeNascimento = ?, 
      email = ?, 
      telefone = ? 
    WHERE idfuncionarios = ?
  `;

  const valores = [
    dados.nome,
    dados.senha,
    dados.cpf,
    dados.dataDeNascimento,
    dados.email,
    dados.telefone,
    id
  ];

  const resultado = await executaQuery(conexao, query, valores);
  conexao.release();

  return resultado.affectedRows; // 👈 retorna quantas linhas foram afetadas
}