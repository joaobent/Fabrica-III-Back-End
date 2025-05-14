import pool from '../../../conexao.js';

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

const SELECT_BASE = `
  SELECT
    ex.idexercicios,
    e.nome         AS nomeEquipamento,
    c.nome                AS nomeCliente,
    f.nome                AS nomeFuncionario,
    m.nome                AS marcaEquipamento
  FROM exercicios ex
  JOIN equipamentos  e ON ex.equipamentos_idequipamentos = e.idequipamentos
  JOIN marca         m ON e.marca_idmarca               = m.idmarca
  JOIN clientes      c ON ex.clientes_idclientes        = c.idclientes
  JOIN funcionarios  f ON ex.funcionarios_idfuncionarios = f.idfuncionarios
`;

async function apresentarExercicios() {
  const sql = `${SELECT_BASE} ORDER BY ex.idexercicios`;
  return executarQuery(sql);
}

async function apresentarExercicioPorId(id) {
  const sql = `${SELECT_BASE} WHERE ex.idexercicios = ?`;
  return executarQuery(sql, [id]);
}

async function apresentarExerciciosPorIdEquipamento(idEquipamento) {
  const sql = `${SELECT_BASE} WHERE e.idequipamentos = ?`;
  return executarQuery(sql, [idEquipamento]);
}

async function apresentarExerciciosPorNomeEquipamento(nome) {
  const sql = `${SELECT_BASE} WHERE e.nome_modelo LIKE ?`;
  return executarQuery(sql, [`%${nome}%`]);
}


export {
  apresentarExercicios,
  apresentarExercicioPorId,
  apresentarExerciciosPorIdEquipamento,
  apresentarExerciciosPorNomeEquipamento
};

