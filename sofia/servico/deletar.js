//MÉTODO DELETE
import pool from "../../conexao.js";

async function executaQuery(conexao, query, params = []) {
	const [rows] = await conexao.execute(query, params);
	return rows;
}

export async function deletarClientePorId(idCliente) {
	const conexao = await pool.getConnection();
	try {
		const query = `DELETE FROM clientes WHERE idclientes = ?`;
		const resultado = await executaQuery(conexao, query, [idCliente]);
		return resultado;
	} finally {
		conexao.release();
	}
}