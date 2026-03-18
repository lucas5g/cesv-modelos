# PRD - Consulta de Modelos de Texto

## 1. Visao geral

Esta aplicacao tem como objetivo permitir que usuarios internos realizem autenticacao com `cpf` e `senha` e, apos o login, consultem modelos de texto da aplicacao.

Os modelos podem representar conteudos de `email` ou `template`, conforme disponibilizado pela API documentada no Swagger:

- `https://dev.gerais.mg.def.br/api-doc/candidato/service/#/Modelos/ModeloController_findAll`

## 2. Objetivo do produto

Centralizar o acesso aos modelos de texto da aplicacao em uma interface simples, segura e de facil consulta.

## 3. Perfil de usuario

- Usuarios internos autorizados

## 4. Escopo

O sistema deve possuir:

- uma tela de login
- uma tela principal com lista simples de modelos
- um painel de detalhes do modelo selecionado

## 5. Fluxo principal do usuario

1. O usuario acessa a tela de login.
2. O usuario informa `cpf` e `senha`.
3. O sistema envia os dados para autenticacao.
4. O endpoint de login retorna um texto contendo o token `JWT`.
5. O sistema armazena o token para as proximas requisicoes autenticadas.
6. O usuario e redirecionado para a tela principal.
7. O sistema consulta a lista de modelos.
8. O usuario visualiza a lista de modelos.
9. Ao clicar em um item da lista, os detalhes do modelo sao exibidos ao lado.

## 6. Integracoes

### 6.1 Autenticacao

- Endpoint: `/scsdp/service/login/interno`
- Credenciais: `cpf` e `senha`
- Retorno: texto puro contendo o token `JWT`

### 6.2 Lista de modelos

- Endpoint: `/candidato/service/modelos`
- Origem: API documentada no Swagger
- Referencia: `https://dev.gerais.mg.def.br/api-doc/candidato/service/#/Modelos/ModeloController_findAll`

### 6.3 Detalhe do modelo

- Endpoint: `/candidato/service/modelos/{co_seq_modelo}`
- Objetivo: retornar os dados completos de um modelo especifico selecionado na lista

## 7. Requisitos funcionais

### 7.1 Login

- O sistema deve exibir uma tela de login com os campos `cpf` e `senha`.
- O sistema deve validar que ambos os campos foram preenchidos antes de enviar a requisicao.
- O sistema deve autenticar o usuario por meio do endpoint `/scsdp/service/login/interno`.
- O sistema deve tratar a resposta do login como texto contendo um token `JWT`.
- O sistema deve armazenar o token para uso nas requisicoes autenticadas.
- O sistema deve impedir acesso a tela principal quando nao houver autenticacao valida.

### 7.2 Tela principal

- O sistema deve consultar a lista de modelos apos autenticacao com sucesso por meio do endpoint `/candidato/service/modelos`.
- O sistema deve exibir uma lista simples de modelos.
- O sistema deve permitir selecionar um item da lista.
- O sistema deve consultar os detalhes do item selecionado por meio do endpoint `/candidato/service/modelos/{co_seq_modelo}`.
- O sistema deve exibir os detalhes do item selecionado em uma area ao lado da lista.

## 8. Dados exibidos na interface

### 8.1 Campos exibidos na lista

Cada item da lista deve exibir:

- `no_modelo`
- `ds_assunto_email` (opcional)

Quando `ds_assunto_email` estiver vazio ou ausente, a interface deve exibir `-`.

### 8.2 Campos exibidos no detalhe

Ao selecionar um modelo, o painel de detalhe deve exibir:

- `no_modelo`
- `ds_assunto_email` (opcional)
- `ds_conteudo_modelo`
- `ds_sms`

Quando qualquer campo exibido no detalhe estiver vazio ou ausente, a interface deve exibir `-`.

## 9. Regras de negocio

- Somente usuarios autenticados podem acessar a tela principal.
- Os campos `cpf` e `senha` sao obrigatorios para autenticacao.
- O token de autenticacao sera recebido em texto puro e deve ser interpretado como um `JWT`.
- O campo `ds_assunto_email` e opcional e sua ausencia nao deve causar erro de exibicao.
- O painel de detalhes deve sempre refletir o item atualmente selecionado na lista.
- A listagem e a visualizacao de detalhe utilizam endpoints distintos.
- Quando nao houver item selecionado, a tabela deve ocupar toda a largura disponivel da tela, respeitando o padding da interface.
- Campos vazios ou ausentes exibidos na interface devem ser apresentados como `-`.

## 10. Requisitos nao funcionais

- A comunicacao com as APIs deve ocorrer via HTTPS.
- A interface deve apresentar estado de carregamento durante login e consulta de modelos.
- A aplicacao deve funcionar adequadamente em desktop e mobile.
- Credenciais e token nao devem ser expostos em logs ou mensagens indevidas.
- A interface deve tratar corretamente campos opcionais ou vazios.

## 11. Estados de tela

### 11.1 Tela de login

- estado inicial
- carregando autenticacao
- erro de validacao
- erro de autenticacao
- erro tecnico

### 11.2 Tela principal

- carregando lista
- lista preenchida
- lista vazia
- erro na consulta
- sem item selecionado, com tabela ocupando toda a largura disponivel
- detalhe exibido para item selecionado

## 12. Criterios de aceite

### 12.1 Login

- O usuario consegue autenticar com `cpf` e `senha` validos.
- O sistema recebe corretamente o token `JWT` retornado em texto puro.
- O usuario nao autenticado nao consegue acessar a tela principal.

### 12.2 Lista e detalhe de modelos

- A lista de modelos e carregada apos login com sucesso.
- A lista exibe `no_modelo` e `ds_assunto_email`, quando disponivel.
- Quando nao houver item selecionado, a lista ocupa toda a largura disponivel da area principal.
- Ao clicar em um item da lista, os detalhes sao exibidos ao lado.
- O detalhe apresenta `no_modelo`, `ds_assunto_email`, `ds_conteudo_modelo` e `ds_sms`.
- A ausencia de `ds_assunto_email` nao quebra a exibicao da lista nem do detalhe.
- Campos vazios ou ausentes sao exibidos como `-`.

### 12.3 Tratamento de erros

- O sistema deve apresentar mensagem clara em caso de falha na autenticacao.
- O sistema deve apresentar mensagem clara em caso de erro na consulta dos modelos.

## 13. Fora de escopo

Nao faz parte deste escopo inicial:

- cadastro de usuarios
- recuperacao de senha
- edicao de modelos
- exclusao de modelos
- filtros avancados ou busca
- paginacao

## 14. Pontos em aberto

No momento, nao ha pontos em aberto registrados para esta versao do escopo.
