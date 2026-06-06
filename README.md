# Favorite Links Web

Frontend do projeto Favorite Links — uma aplicação para organizar links pessoais com tags e categorias.

## 🔗 Links

- **Documentação da API:** https://favorite-links.onrender.com/docs
- **Repositório da API:** https://github.com/nandohawkeye/favorite_links_api

## 🛠️ Stack

- Next.js 16 + TypeScript
- Tailwind CSS v4
- Jest + React Testing Library
- js-cookie

## ✨ Funcionalidades

- Autenticação com JWT (login e cadastro)
- Proteção de rotas via proxy (middleware do Next.js 16)
- Listagem de links com busca por título e URL
- Filtro de links por tag
- Criação, edição e exclusão de links
- Gerenciamento de tags com cor (hex) e ícone (unicode)
- Feedback visual de loading e erros

## 📦 Instalação

```bash
git clone https://github.com/nandohawkeye/favorite-linkk-web
cd favorite-linkk-web
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse `http://localhost:3001` no navegador.

## 🧪 Testes

```bash
npm test
```

Cobertura de testes com Jest + React Testing Library:

- `LoginPage` — renderização, erro de credenciais, chamada da API
- `RegisterPage` — renderização, email duplicado, chamada da API
- `LinkModal` — criação, edição, erro, cancelamento
- `TagModal` — criação, edição, erro, cancelamento

## 📋 Estrutura do projeto

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   └── (dashboard)/
│       ├── tags/
│       │   └── page.tsx
│       ├── layout.tsx
│       └── page.tsx
├── components/
│   ├── LinkModal.tsx
│   └── TagModal.tsx
├── lib/
│   └── api.ts
├── types/
│   └── index.ts
├── __tests__/
│   ├── LoginPage.test.tsx
│   ├── RegisterPage.test.tsx
│   ├── LinkModal.test.tsx
│   └── TagModal.test.tsx
└── proxy.ts
```

## 🔐 Autenticação

O token JWT é armazenado em cookie via `js-cookie` e validado pelo `proxy.ts` do Next.js 16 a cada requisição. Rotas protegidas redirecionam automaticamente para `/login` quando o usuário não está autenticado. Rotas de autenticação redirecionam para `/` quando o usuário já está logado.

## 🚀 Deploy

O projeto está deployado no [Render](https://render.com) como um serviço Node.js.
