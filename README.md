# Zest

An open source budget application built using the Next.js 13 and Plaid.

![1682137893878-godly-nize](https://user-images.githubusercontent.com/28488571/233762642-47b47b4c-8944-4077-90e7-c41f0937e07a.jpeg)

## About this project

I wanted to learn modern app development in Next.js 13 beta features and server components. So I decided to build a budget application using Next.js 13 and Plaid. The issue is Plaid doesn't support OAuth unless you sign up for the production tier, so some banks might be missing. You could try the development tier and see how that goes. If you have any problems, feel free to open an issue or reach out to me.



## Features
- Built using **Plaid**
- New `/app` dir,
- Routing, Layouts, Nested Layouts and Layout Groups
- Data Fetching, Caching and Mutation
- Loading UI
- Server and Client Components
- API Routes and Middlewares
- ORM using **Prisma**
- Database using **SQLite**
- UI Components built using **Radix UI** and [@shadcn](https://twitter.com/shadcn) components
- Styled using **Tailwind CSS**
- Validations using **Zod**
- Written in **TypeScript**

## Running Locally

1. Install dependencies using pnpm:

```sh
npm install
```

2. Create a Plaid account and get your API keys.

3. Install sqlite3.

4. Copy `.env.example` to `.env` and update the variables.

```sh
cp .env.example .env
```

3. Start the development server:

```sh
npm run dev
```

## License

Licensed under the [MIT license](https://github.com/vedkale/zest/blob/main/LICENSE).
