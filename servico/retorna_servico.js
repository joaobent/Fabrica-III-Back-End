// Aqui serão colocadas todas as funções para LISTAR(GET) as tabelas 

const db = require('./conexao');

async function retornaFrequencias(req, res) {
  try {
    const resultado = await db.query('SELECT * FROM frequencia');
    res.status(200).json(resultado[0]); // resultado[0] é o array de dados
  } catch (erro) {
    console.error('Erro ao retornar frequencias: ', erro);
    res.status(500).json({ erro: 'Erro interno ao buscar frequências' });
  }
}

module.exports = retornaFrequencias;
