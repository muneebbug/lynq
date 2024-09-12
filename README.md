# Lynq – Modern Link Shortening Solution

A full-stack, high-performance link shortener built with **Nuxt 3**, leveraging modern technologies like **Prisma**, **tRPC**, **sidebase/nuxt-auth**, and **TailwindCSS** to deliver a seamless user experience. Lynq offers robust user authentication and customizable UI components for developers.

## Features

- ✔️ **Nuxt 3** for fast and scalable SSR/SSG.
- ✔️ **Prisma** for efficient database management and querying.
- ✔️ **tRPC** for type-safe API integration.
- ✔️ User authentication via **sidebase/nuxt-auth** with password and social login powered by **Auth.js** and **Next-Auth**.
- ✔️ Customizable UI using **shadcn** integrated with **TailwindCSS**.
- ✔️ Modern design system based on **shadcn/nuxt** module.

## Setup

1. Clone the repository.
2. Rename `.example.env` to `.env` and set the required environment variables.
3. Install dependencies.

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install
```

4. Generate Prisma client:

```bash
npx prisma generate
```

## Development

Start the development server on [http://localhost:3000](http://localhost:3000):

```bash
npm run dev
```

## Production

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

For more deployment details, check out the [Nuxt documentation](https://nuxt.com/docs/getting-started/deployment).

---

Contributions are welcome!