# Lynq – Modern Link Shortening Solution

A full-stack, high-performance link shortener built with **Nuxt 3**, leveraging modern technologies like **Prisma**, **tRPC**, **sidebase/nuxt-auth**, and **TailwindCSS** to deliver a seamless user experience. Lynq offers robust user authentication and customizable UI components for developers.

## Features

- ✔️ **Nuxt 3** for fast and scalable SSR/SSG.
- ✔️ **Prisma** for efficient database management and querying.
- ✔️ **tRPC** for type-safe API integration.
- ✔️ User authentication via **sidebase/nuxt-auth** with password and social login powered by **Auth.js** and **Next-Auth**.
- ✔️ Customizable UI using **shadcn** integrated with **TailwindCSS**.
- ✔️ Modern design system based on **shadcn/nuxt** module.

## Database Configuration

This project uses separate databases for development and production:

### Local Development
- Uses a local PostgreSQL instance
- Set in `.env` file: `DATABASE_URL="postgresql://username:password@localhost:5432/lynq_dev"`

### Production Environment
- Uses Neon serverless PostgreSQL
- Set in Vercel environment variables: `DATABASE_URL="postgresql://user:password@host:port/database"`

## Database Migrations

### Development
```bash
# Create a new migration after schema changes
npx prisma migrate dev --name your_migration_name

# Apply migrations to local database
npx prisma migrate deploy
```

### Production
- Migrations automatically run during Vercel deployment
- The build process includes `npx prisma migrate deploy` to apply migrations

## Setting up

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Create `.env` file with your local database URL
4. Apply migrations: `npx prisma migrate deploy`
5. Generate Prisma client: `npx prisma generate`
6. Run development server: `pnpm dev`

## Deployment to Vercel

1. Add your production `DATABASE_URL` to Vercel environment variables
2. Every deployment will automatically run migrations on the production database

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