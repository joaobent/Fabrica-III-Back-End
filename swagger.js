// swagger.js
import swaggerAutogen from 'swagger-autogen';
const doc = {
  openapi: '3.0.0',
  info: {
    title: 'API da academia - ALMSFIT',
    version: '1.0.0',
    description: 'API do projeto de fábrica de software ALMSFIT',
  },
  servers: [
    {
      url: 'https://almsfitapi.dev.vilhena.ifro.edu.br/api',
      description: 'Servidor de Produção',
    },
    {
      url: 'http://localhost:9000/api-docs',
      description: 'Servidor de Desenvolvimento',
    },
  ],
  tags: [
    {
      name: 'Frequência',
      description: 'Operações relacionadas à frequência dos clientes',
    },
    {
      name: 'Formação',
      description: 'Operações relacionadas à formação dos funcionários',
    },
    {
      name: 'Endereço',
      description: 'Operações relacionadas ao endereço',
    },
  
    // Adicione mais tags se quiser
  ],
  components: {},
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./index.js', './ana/rotas/endereco.js']; // pode adicionar mais arquivos aqui, como suas rotas

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Documentação Swagger gerada com sucesso!');
});
