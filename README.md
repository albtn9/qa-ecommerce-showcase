# QA Ecommerce Showcase

Aplicacao React + TypeScript para demonstracao de fluxo de ecommerce com login, listagem de produtos, carrinho e checkout.

## Funcionalidades

- Login com validacao de credenciais via API mock (`json-server`)
- Rotas protegidas para `products`, `cart` e `checkout`
- Listagem de produtos com filtros por categoria
- Carrinho com adicionar, remover e alterar quantidade
- Persistencia do carrinho em `localStorage`
- Checkout com validacoes de formulario e pagamento (`cartao`/`pix`)
- Tratamento de erro de API no checkout e na listagem de produtos
- Testes E2E com Cypress cobrindo autenticacao, persistencia e checkout

## Tecnologias

- React 19
- TypeScript
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- JSON Server
- Cypress

## Estrutura principal

```text
qa-ecommerce-showcase/
  src/
    components/
      ProtectedRoute.tsx
    context/
      CartContext.tsx
    pages/
      Login.tsx
      Products.tsx
      Cart.tsx
      Checkout.tsx
    services/
      api.ts
    App.tsx
    main.tsx
  server/
    db.json
  cypress/
    e2e/
      auth-and-cart-persistence.cy.js
      checkout-flow.cy.js
  cypress.config.ts
  package.json
```

## Pre-requisitos

- Node.js 18+ (recomendado Node 20+)
- npm

## Instalacao

```bash
npm install
```

## Como executar

Voce precisa de 2 terminais:

1. API mock (`json-server`) em `http://localhost:3001` (users/products/orders)
2. Frontend (`Vite`) em `http://localhost:5173`

### 1) Subir a API

```bash
npm run server
```

### 2) Subir o frontend

```bash
npm run dev
```

## Scripts disponiveis

- `npm run dev`: inicia frontend em modo desenvolvimento
- `npm run server`: inicia API mock com `server/db.json`
- `npm run build`: gera build de producao
- `npm run preview`: sobe preview da build
- `npm run cy:open`: abre Cypress em modo interativo
- `npm run cy:run`: executa Cypress em modo headless

## Credenciais de teste

Definidas em `server/db.json`:

- Usuario comum
  - Email: `user@email.com`
  - Senha: `123456`
- Admin
  - Email: `admin@email.com`
  - Senha: `admin123`

## Rotas da aplicacao

- `/` -> login
- `/products` -> produtos (protegida)
- `/cart` -> carrinho (protegida)
- `/checkout` -> checkout (protegida)

Se nao houver usuario salvo em `localStorage.user`, as rotas protegidas redirecionam para `/`.

## Dados locais (localStorage)

- `user`: usuario autenticado
- `cartItems`: itens do carrinho persistidos

## API de produtos (json-server)

`products` são consumidos do `json-server` local:

- `GET /products`
- `GET /products/:id` (caso necessário)

E o `json-server` também expõe:

- `GET /users`
- `POST /orders`

## Testes E2E (Cypress)

Arquivos:

- `cypress/e2e/auth-and-cart-persistence.cy.js`
  - valida redirecionamento de rota protegida sem login
  - valida persistencia do carrinho apos reload
- `cypress/e2e/checkout-flow.cy.js`
  - valida checkout com sucesso e redirecionamento para `/products`
  - valida fluxo de erro quando `POST /orders` falha

### Rodar testes

Com frontend e API ativos:

```bash
npm run cy:open
```

ou

```bash
npm run cy:run
```

## Regras e comportamentos importantes

- O checkout exige:
  - dados de entrega preenchidos
  - forma de pagamento selecionada
  - dados de cartao se pagamento for `cartao`
- Botao `Confirmar Pedido` fica desabilitado durante envio para evitar clique duplo
- Se a API falhar no checkout, o usuario recebe alerta de erro e permanece em `/checkout`
- Em sucesso, carrinho e limpo e o usuario e redirecionado para `/products`

## Troubleshooting

- **Nao carrega produtos / erro ao finalizar pedido**
  - Verifique se `npm run server` esta rodando na porta `3001`
- **Cypress falha ao abrir aplicacao**
  - Verifique se `npm run dev` esta ativo em `http://localhost:5173`
- **Rotas protegidas redirecionando para login**
  - Confirme se `localStorage.user` existe (faca login novamente)

## Melhorias futuras sugeridas

- Adicionar botao de logout global
- Criar testes unitarios para contexto de carrinho
- Melhorar validacao de campos (mascaras, formato de CEP, cartao e CVV)
- Adicionar feedback visual sem `alert` (toasts/modais)

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
