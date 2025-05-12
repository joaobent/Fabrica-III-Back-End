//Frequência

import pool from "./conexao.js";

//atualiza frequencia

export async function atualizaFrequencia(idfrequencia, novosDados) {
    const conexao = await pool.getConnection();

    const query = `
        UPDATE frequencia
        SET dataEntrada = ?, dataSaida = ?, clientes_idclientes = ?
        WHERE idfrequencia = ?
    `;

    const { dataEntrada, dataSaida, clientes_idclientes } = novosDados;

    const [resultado] = await conexao.execute(query, [
        dataEntrada,
        dataSaida,
        clientes_idclientes,
        idfrequencia
    ]);

    conexao.release();
    return resultado;
}

// Exemplo de uso:
// await atualizaFrequenciaParcial(3, { dataSaida: '2025-05-12 16:00:00' });


// cadastra_frequencia.js

export async function cadastraFrequencia(clientes_idclientes, dataEntrada, dataSaida, idfrequencia) {
    const conexao = await pool.getConnection();

    const query = `
        INSERT INTO frequencia (clientes_idclientes, dataEntrada, dataSaida, idfrequencia)
        VALUES (?, ?, ?)
    `;

    const [resultado] = await conexao.execute(query, [clientes_idclientes, dataEntrada, dataSaida , idfrequencia]);
    conexao.release();
    return resultado.insertId;
}


//atualiza frequencia

import pool from "./conexao.js";

export async function atualizaFrequencia(idfrequencia, novosDados) {
    const conexao = await pool.getConnection();

    const query = `
        UPDATE frequencia
        SET dataEntrada = ?, dataSaida = ?, clientes_idclientes = ?
        WHERE idfrequencia = ?
    `;

    const { dataEntrada, dataSaida, clientes_idclientes } = novosDados;

    const [resultado] = await conexao.execute(query, [
        dataEntrada,
        dataSaida,
        clientes_idclientes,
        idfrequencia
    ]);

    conexao.release();
    return resultado;
}


// Rota para atualizar uma frequência existente index.js
// import {atualizaFrequencia} from "./servico/atualiza_servico.js"
app.put('/frequencia/:id', async (req, res) => {
    const { id } = req.params;
    const { dataEntrada, dataSaida } = req.body;
    try {
        const sucesso = await atualizaFrequencia(id, dataEntrada, dataSaida);
        if (sucesso) {
            res.json({ mensagem: 'Frequência atualizada com sucesso' });
        } else {
            res.status(404).json({ mensagem: 'Frequência não encontrada' });
        }
    } catch (erro) {
        console.error('Erro ao atualizar frequência:', erro);
        res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
});





// deleta_frequencia.js
// import { deletaFrequencia } from './servico/deleta_servico.js';


export async function deletaFrequencia(idfrequencia) {
    const conexao = await pool.getConnection();

    const query = `
        DELETE FROM frequencia WHERE idfrequencia = ?
    `;

    const [resultado] = await conexao.execute(query, [idfrequencia]);
    conexao.release();
    return resultado.affectedRows > 0;
}

// Rota para deletar uma frequência index.js
app.delete('/frequencia/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const sucesso = await deletaFrequencia(id);
        if (sucesso) {
            res.json({ mensagem: 'Frequência excluída com sucesso' });
        } else {
            res.status(404).json({ mensagem: 'Frequência não encontrada' });
        }
    } catch (erro) {
        console.error('Erro ao excluir frequência:', erro);
        res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
});
