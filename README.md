# E-commerce Backend - Sistema de Autenticação e Autorização

Sistema de backend para e-commerce com autenticação JWT, autorização baseada em roles e CRUD completo de usuários.

## Tecnologias Utilizadas

- Node.js
- Express.js
- MongoDB com Mongoose
- Passport.js (Local + JWT strategies)
- Bcrypt para criptografia
- JSON Web Tokens (JWT)
- Express Validator

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente no arquivo `.env`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRATION=24h
```

4. Certifique-se de que o MongoDB está rodando em sua máquina

5. Inicie o servidor:
```bash
npm run dev  # Para desenvolvimento com nodemon
# ou
npm start    # Para produção
```

## Estrutura do Projeto

```
src/
├── config/
│   ├── database.js    # Configuração do MongoDB
│   └── passport.js     # Estratégias do Passport
├── controllers/
│   ├── sessions.controller.js  # Controlador de autenticação
│   └── users.controller.js     # Controlador CRUD de usuários
├── middlewares/
│   └── auth.js         # Middlewares de autenticação e autorização
├── models/
│   ├── Cart.js         # Modelo de carrinho
│   ├── Product.js      # Modelo de produto
│   └── User.js         # Modelo de usuário
├── routes/
│   ├── sessions.router.js  # Rotas de autenticação
│   └── users.router.js     # Rotas CRUD de usuários
├── utils/
│   └── jwt.js          # Utilitários para JWT
└── app.js              # Aplicação principal
```

## Modelo de Usuário

O modelo User contém os seguintes campos:
- `first_name`: String (obrigatório)
- `last_name`: String (obrigatório)
- `email`: String (único, obrigatório)
- `age`: Number (obrigatório)
- `password`: String (criptografado com bcrypt)
- `cart`: Referência ao modelo Cart
- `role`: String (padrão: 'user', valores: 'user' ou 'admin')

## Endpoints da API

### Autenticação (/api/sessions)

#### Registro de Usuário
```
POST /api/sessions/register
```
Body:
```json
{
  "first_name": "João",
  "last_name": "Silva",
  "email": "joao@example.com",
  "age": 25,
  "password": "senha123"
}
```

#### Login
```
POST /api/sessions/login
```
Body:
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

#### Obter Usuário Atual
```
GET /api/sessions/current
```
Headers:
```
Authorization: Bearer {token}
```

#### Logout
```
POST /api/sessions/logout
```

### CRUD de Usuários (/api/users)

#### Listar Todos os Usuários (Admin)
```
GET /api/users
```
Headers:
```
Authorization: Bearer {token}
```

#### Obter Usuário por ID
```
GET /api/users/:id
```
Headers:
```
Authorization: Bearer {token}
```

#### Criar Novo Usuário (Admin)
```
POST /api/users
```
Headers:
```
Authorization: Bearer {token}
```
Body:
```json
{
  "first_name": "Maria",
  "last_name": "Santos",
  "email": "maria@example.com",
  "age": 30,
  "password": "senha456",
  "role": "user"
}
```

#### Atualizar Usuário
```
PUT /api/users/:id
```
Headers:
```
Authorization: Bearer {token}
```
Body:
```json
{
  "first_name": "Maria",
  "last_name": "Santos Silva",
  "age": 31
}
```

#### Atualizar Senha
```
PUT /api/users/:id/password
```
Headers:
```
Authorization: Bearer {token}
```
Body:
```json
{
  "currentPassword": "senha456",
  "newPassword": "novaSenha789"
}
```

#### Deletar Usuário (Admin)
```
DELETE /api/users/:id
```
Headers:
```
Authorization: Bearer {token}
```

## Segurança

- Senhas são criptografadas usando bcrypt com salt rounds de 10
- Autenticação baseada em JWT tokens
- Tokens expiram em 24 horas (configurável)
- Autorização baseada em roles (user/admin)
- Validação de entrada usando express-validator
- Estratégias do Passport para autenticação local e JWT

## Testando a API

Você pode usar ferramentas como Postman ou cURL para testar os endpoints.

### Exemplo de Fluxo de Teste:

1. Registre um novo usuário via `/api/sessions/register`
2. Faça login via `/api/sessions/login` para obter o token JWT
3. Use o token no header `Authorization: Bearer {token}` para acessar rotas protegidas
4. Teste a rota `/api/sessions/current` para validar o token
5. Use as rotas de CRUD de usuários conforme necessário

## Notas Importantes

- O primeiro usuário registrado pode ser manualmente alterado para admin no banco de dados
- Apenas admins podem listar todos os usuários, criar novos usuários via CRUD e deletar usuários
- Cada usuário criado automaticamente recebe um carrinho associado
- As senhas nunca são retornadas nas respostas da API (método toJSON do modelo)