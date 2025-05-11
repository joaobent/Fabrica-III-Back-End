// Aqui serÃo colocadas todos os endpoints da API
import multer from 'multer';
const storage = multer.memoryStorage(); // salva o arquivo em buffer
const upload = multer({ storage: storage });

import express from 'express';
// import pool from './servico/conexao.js';
import {retornaFuncionarios,
    retornaFuncionariosPorNome, retornaFrequencias, retornaFrequenciasPorClienteId} from "./servico/retorna_servico.js"
import {cadastrarFuncionario} from "./servico/funcoesDaAna.js"

const app = express();
app.use(express.json()); 

app.get('/funcionarios', async (req, res) => {
    let resultado;
    const nome = req.query.nome;

    try {
        if (!nome) {
            resultado = await retornaFuncionarios();
        } else if (nome) {
            resultado = await retornaFuncionariosPorNome(nome);
        } 

        if (resultado.length > 0) {
            res.json(resultado);
        } else {
            res.status(404).json({ mensagem: "Nenhum funcionário encontrado" });
        }
    } catch (erro) {
        console.error("Erro ao buscar funcionários:", erro);
        res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
});

app.get('/frequencia', async (req, res) => {
    try {
        const frequencias = await retornaFrequencias();
        if (frequencias.length > 0) {
            res.json(frequencias);
        } else {
            res.status(404).json({ mensagem: 'Nenhuma frequência encontrada' });
        }
    } catch (erro) {
        console.error('Erro ao buscar frequências:', erro);
        res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
});

// Rota para buscar uma frequência por ID
app.get('/frequencia/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const frequencia = await retornaFrequenciasPorClienteId(id);
        if (frequencia) {
            res.json(frequencia);
        } else {
            res.status(404).json({ mensagem: 'Frequência não encontrada' });
        }
    } catch (erro) {
        console.error('Erro ao buscar frequência por ID:', erro);
        res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
});
app.post('/funcionarios', upload.single('certificado'), async (req, res) => {
    const {
        nome,
        senha,
        cpf,
        dataDeNascimento,
        email,
        telefone,
        cep,
        numeroCasa,
        complemento,
        formacao
    } = req.body;

    const certificadoBuffer = req.file?.buffer;

    const dados = {
        nome,
        senha,
        cpf,
        dataDeNascimento,
        email,
        telefone,
        fotoPerfil: telefone, // ajustar se necessário
        endereco: {
            cep,
            numeroCasa,
            complemento
        },
        formacao: {
            formacao,
            certificado: certificadoBuffer
        }
    };

    try {
        const resultado = await cadastrarFuncionario(dados);
        res.status(201).json({ mensagem: 'Funcionário cadastrado com sucesso', id: resultado.insertId });
    } catch (erro) {
        console.error("Erro ao cadastrar funcionário:", erro);
        res.status(500).json({ erro: 'Erro ao cadastrar funcionário' });
    }
});

app.listen(9000, () => {
    const data = new Date();
    console.log("Servidor de funcionários rodando em: " + data);
});