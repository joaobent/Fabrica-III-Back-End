import pool from "../../../conexao.js";

export async function executaQuery(conexao, query, params) {
  const [rows] = await conexao.execute(query, params);
  return rows;
}




export async function atualizarFuncionarioParcial(id, dados) {
  const conexao = await pool.getConnection();
  try {
    await conexao.beginTransaction();

    // Atualiza FUNCIONARIOS
    const queryFuncionario = `
      UPDATE funcionarios SET 
        nome = ?,  
        senha = ?, 
        cpf = ?, 
        dataDeNascimento = ?, 
        email = ?, 
        telefone = ?,
        fotoPerfil = ?
      WHERE idfuncionarios = ?
    `;

    const valoresFuncionario = [
      dados.nome ?? null,
      dados.senha ?? null,
      dados.cpf ?? null,
      dados.dataDeNascimento ?? null,
      dados.email ?? null,
      dados.telefone ?? null,
      dados.fotoPerfil ?? null,
      id
    ];

    await conexao.execute(queryFuncionario, valoresFuncionario);

    // Atualiza ENDERECO (se houver)
    if (dados.endereco && dados.idEndereco) {
      const queryEndereco = `
        UPDATE endereco SET 
          cep = ?, 
          numeroCasa = ?, 
          complemento = ?
        WHERE idendereco = ?
      `;

      const valoresEnderecos = [
        dados.endereco.cep ?? null,
        dados.endereco.numeroCasa ?? null,
        dados.endereco.complemento ?? null,
        dados.idEndereco
      ];

      await conexao.execute(queryEndereco, valoresEnderecos);
    }

    await conexao.commit();
    return true;

  } catch (erro) {
    await conexao.rollback();
    throw erro;
  } finally {
    conexao.release();
  }
}


export async function atualizarFuncionario(id, dados) {
  const conexao = await pool.getConnection();

  try {
    await conexao.beginTransaction();

    // Atualizar tabela funcionarios
    const camposFuncionario = [];
    const valoresFuncionario = [];

    if (dados.nome !== undefined) {
      camposFuncionario.push('nome = ?');
      valoresFuncionario.push(dados.nome);
    }
    if (dados.senha !== undefined) {
      camposFuncionario.push('senha = ?');
      valoresFuncionario.push(dados.senha);
    }
    if (dados.cpf !== undefined) {
      camposFuncionario.push('cpf = ?');
      valoresFuncionario.push(dados.cpf);
    }
    if (dados.dataDeNascimento !== undefined) {
      camposFuncionario.push('dataDeNascimento = ?');
      valoresFuncionario.push(dados.dataDeNascimento);
    }
    if (dados.email !== undefined) {
      camposFuncionario.push('email = ?');
      valoresFuncionario.push(dados.email);
    }
    if (dados.telefone !== undefined) {
      camposFuncionario.push('telefone = ?');
      valoresFuncionario.push(dados.telefone);
    }
    if (dados.fotoPerfil !== undefined) {
      camposFuncionario.push('fotoPerfil = ?');
      valoresFuncionario.push(dados.fotoPerfil);
    }

    if (camposFuncionario.length > 0) {
      const queryFuncionario = `
        UPDATE funcionarios SET ${camposFuncionario.join(', ')} WHERE idfuncionarios = ?
      `;
      valoresFuncionario.push(id);
      await conexao.execute(queryFuncionario, valoresFuncionario);
    }

    // Atualizar tabela endereco
    if (dados.endereco) {
      const camposEndereco = [];
      const valoresEndereco = [];

      if (dados.endereco.cep !== undefined) {
        camposEndereco.push('cep = ?');
        valoresEndereco.push(dados.endereco.cep);
      }
      if (dados.endereco.numeroCasa !== undefined) {
        camposEndereco.push('numeroCasa = ?');
        valoresEndereco.push(dados.endereco.numeroCasa);
      }
      if (dados.endereco.complemento !== undefined) {
        camposEndereco.push('complemento = ?');
        valoresEndereco.push(dados.endereco.complemento);
      }

      if (camposEndereco.length > 0) {
        if (!dados.idEndereco) {
          throw new Error('ID do endereço é necessário para atualização.');
        }
        const queryEndereco = `
          UPDATE endereco SET ${camposEndereco.join(', ')} WHERE idendereco = ?
        `;
        valoresEndereco.push(dados.idEndereco);
        await conexao.execute(queryEndereco, valoresEndereco);
      }
    }

    // Atualizar tabela formacao
    if (dados.formacao) {
      const camposFormacao = [];
      const valoresFormacao = [];

      if (dados.formacao.formacao !== undefined) {
        camposFormacao.push('formacao = ?');
        valoresFormacao.push(dados.formacao.formacao);
      }
      if (dados.formacao.certificado !== undefined) {
        camposFormacao.push('certificado = ?');
        valoresFormacao.push(dados.formacao.certificado);
      }

      if (camposFormacao.length > 0) {
        if (!dados.idFormacao) {
          throw new Error('ID da formação é necessário para atualização.');
        }
        const queryFormacao = `
          UPDATE formacao SET ${camposFormacao.join(', ')} WHERE idformacao = ?
        `;
        valoresFormacao.push(dados.idFormacao);
        await conexao.execute(queryFormacao, valoresFormacao);
      }
    }

    await conexao.commit();
    return true;

  } catch (erro) {
    await conexao.rollback();
    throw erro;
  } finally {
    conexao.release();
  }
}

