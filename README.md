# ✅ API Task List

Uma API REST desenvolvida em Node.js com Express e integração ao MySQL, criada para gerenciar usuários e tarefas.

---

# 🎯 Sobre o Projeto

O projeto consiste em uma API para gerenciamento de tarefas, permitindo:

- 👤 Cadastro de usuários
- 🔐 Login de usuários
- 📋 Cadastro de tarefas
- ✏️ Atualização de tarefas
- 🗑️ Exclusão de tarefas
- ✅ Controle de tarefas concluídas ou não concluídas
- 🔎 Listagem de tarefas
- 🔒 Autenticação das requisições utilizando JWT

O projeto foi desenvolvido com foco em:

- Prática de backend com Node.js
- Criação de uma API REST
- Integração com banco de dados MySQL
- Relacionamento entre tabelas
- Validação de dados
- Criação de middleware
- Autenticação com JWT
- Hash de senhas
- Organização e separação de responsabilidades

---

# 🚀 Funcionalidades

- 👤 Cadastro de usuários
- 🔐 Login de usuários
- 🔑 Geração de token JWT
- 🔒 Proteção das rotas utilizando middleware de autenticação
- 🔐 Criação de hash para as senhas dos usuários
- ✅ Comparação de senha utilizando hash
- 📋 Cadastro de tarefas
- ✏️ Edição de tarefas
- 🗑️ Exclusão de tarefas
- 📋 Listagem de tarefas
- ✅ Marcação de tarefa como concluída ou não concluída
- 🔗 Relacionamento das tarefas com os usuários
- ✅ Validação dos dados enviados pelo usuário

---

# 📡 Rotas da API

As rotas da API são organizadas para trabalhar com usuários, sessões e tarefas.

```txt
POST   /users
PUT    /users
POST   /sessions

POST   /tasks
GET    /tasks
PUT    /tasks/:task_id
DELETE /tasks/:task_id
```

> As rotas podem ser ajustadas conforme a configuração do arquivo `routes.js`.

---

# 📂 Estrutura do Projeto

```txt
API-task-list/

├── sources/
│   ├── app/
│   │   └── controllers/
│   │       ├── SessionController.js
│   │       ├── TaskController.js
│   │       └── UserController.js
│   │
│   ├── middlewares/
│   │   └── authentication.js
│   │
│   ├── config/
│   │   └── auth.js
│   │
│   ├── database/
│   │   ├── .gitkeep
│   │   └── connection.js
│   │
│   ├── utils/
│   │   ├── decryptPassword.js
│   │   └── encryptPassword.js
│   │
│   ├── app.js
│   ├── routes.js
│   └── server.js
│
├── .gitignore
├── nodemon.json
├── package.json
├── package-lock.json
└── README.md
```

---

# 🧠 Conceitos Aplicados

- API REST
- Node.js
- Express
- Programação assíncrona com `async/await`
- MySQL
- `mysql2`
- Queries SQL parametrizadas
- CRUD
- `SELECT`, `INSERT`, `UPDATE` e `DELETE`
- `WHERE`
- Foreign Keys
- Relacionamento entre tabelas
- Pool de conexões
- Manipulação de arrays e objetos
- Validação de dados
- Autenticação
- JWT
- Middleware
- Hash de senhas
- `bcrypt`
- HTTP Status Codes
- Separação de responsabilidades

---

# 🗄️ Banco de Dados

O projeto utiliza MySQL para armazenar os dados dos usuários e das tarefas.

As principais tabelas utilizadas são:

```txt
users
tasks
```

## Relacionamentos

```txt
users.id
   ↓
tasks.user_id
```

A coluna `user_id` da tabela `tasks` relaciona cada tarefa ao usuário responsável por ela.

---

# 🔐 Segurança e Validações

O projeto utiliza queries parametrizadas com `?` para evitar SQL Injection.

Exemplo:

```js
const sql = `
UPDATE tasks
SET task = ?
WHERE id = ?
`;

await connection.execute(sql, [task, task_id]);
```

As senhas dos usuários não são armazenadas diretamente no banco de dados. Antes do cadastro, a senha é transformada em hash e armazenada na coluna `password_hash`.

No login, a senha informada pelo usuário é comparada com o hash armazenado no banco.

O projeto também utiliza JWT para autenticar o usuário e middleware para validar o token enviado nas requisições.

---

# 🔑 Autenticação com JWT

Após realizar o login, a API gera um token JWT contendo o ID do usuário no payload.

Exemplo:

```js
jwt.sign({id}, authConfig.secret, {
    expiresIn: authConfig.expiresIn
})
```

Nas rotas protegidas, o middleware recebe o token através do cabeçalho `Authorization`, verifica sua validade e disponibiliza o ID do usuário através de `req.userId`.

O fluxo funciona da seguinte forma:

```txt
Login
  ↓
Verificação do email
  ↓
Verificação da senha
  ↓
Geração do JWT
  ↓
Token enviado ao usuário
  ↓
Requisição para rota protegida
  ↓
Middleware verifica o token
  ↓
req.userId recebe o ID do usuário
  ↓
Controller
```

---

# ✅ Sistema de Tarefas

As tarefas possuem um campo `check` utilizado para identificar se a tarefa foi concluída.

```txt
0 → tarefa não concluída
1 → tarefa concluída
```

Ao cadastrar uma nova tarefa, o campo começa automaticamente como `0`.

Exemplo:

```sql
check BOOLEAN NOT NULL DEFAULT 0
```

---

# 🕒 Data de Criação e Atualização

As tabelas utilizam campos para armazenar automaticamente a data e hora da criação e da última atualização do registro.

```sql
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

O campo `created_at` registra quando o registro foi criado.

O campo `updated_at` é atualizado automaticamente pelo MySQL quando o registro sofre uma alteração.

---

# 🔗 Relacionamento entre Usuários e Tarefas

Cada tarefa possui um `user_id`, relacionando a tarefa ao usuário responsável.

```sql
FOREIGN KEY (user_id)
REFERENCES users(id)
```

Esse relacionamento permite identificar quais tarefas pertencem a cada usuário.

---

# 🛠️ Tecnologias Utilizadas

- Node.js
- Express
- MySQL
- mysql2
- Yup
- JSON Web Token
- bcrypt
- CORS
- Nodemon
- Sucrase

---

# 📦 Dependências

Instalação das dependências:

```bash
npm install
```

Principais bibliotecas utilizadas:

```bash
npm install express mysql2 yup jsonwebtoken bcrypt cors
npm install -D nodemon sucrase
```

> Caso o projeto já possua o `package.json`, basta executar `npm install`.

---

# ⚙️ Como Executar

## Clone o repositório

```bash
git clone <https://github.com/joaopedro-h/task-list-api.git>
```

---

## Entre na pasta do projeto

```bash
cd API-task-list
```

---

## Instale as dependências

```bash
npm install
```

---

## Configure o banco de dados MySQL

Crie o banco de dados e as tabelas utilizadas pelo projeto.

Exemplo de criação das tabelas:

```sql
CREATE DATABASE task_list;

USE task_list;

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    task VARCHAR(255) NOT NULL,
    check BOOLEAN NOT NULL DEFAULT 0,
    user_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
);
```

### Relação entre as tabelas

```txt
users.id
   ↓
tasks.user_id
```

> Caso utilize outro nome para o banco de dados, substitua `task_list` pelo nome configurado no seu `database/connection.js`.

---

## Configure a conexão

No arquivo:

```txt
sources/database/connection.js
```

configure os dados da conexão:

```txt
host
user
password
database
```

---

## Configure a autenticação

No arquivo:

```txt
sources/config/auth.js
```

configure a chave utilizada pelo JWT e o tempo de expiração do token.

Exemplo:

```txt
secret
expiresIn
```

---

## Execute o projeto

Caso o projeto utilize o script de desenvolvimento:

```bash
npm run dev
```

Ou execute o servidor conforme os scripts definidos no `package.json`.

---

# 📚 Objetivo do Projeto

Este projeto foi desenvolvido como prática de:

- backend com Node.js
- criação de APIs REST
- MySQL e SQL
- relacionamento entre tabelas
- CRUD
- autenticação com JWT
- middleware
- hash de senhas
- validação de dados
- organização de projetos backend
