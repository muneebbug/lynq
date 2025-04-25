# Database Setup Guide

## Local Development Database

1. **Install PostgreSQL** locally if you haven't already
2. Create a new database:
   ```sql
   CREATE DATABASE lynq_dev;
   ```
3. Create a user (or use existing one):
   ```sql
   CREATE USER your_username WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE lynq_dev TO your_username;
   ```
4. Configure your `.env` file with local database connection:
   ```
   DATABASE_URL="postgresql://your_username:your_password@localhost:5432/lynq_dev"
   NODE_ENV="development"
   ```

## Production Database (Neon)

1. Create an account on [Neon](https://neon.tech/) if you don't have one
2. Create a new PostgreSQL database project
3. Get your connection string from Neon dashboard
4. Add the connection string to Vercel environment variables:
   ```
   DATABASE_URL="postgresql://[user]:[password]@[endpoint]/[database]"
   NODE_ENV="production"
   ```

## Converting From Direct Schema Pushes to Migrations

If you've been using `prisma db push` and want to switch to migrations:

1. Create your first migration based on current schema:
   ```bash
   npx prisma migrate dev --name init
   ```
2. For future schema changes, create new migrations:
   ```bash
   # After modifying schema.prisma
   npx prisma migrate dev --name add_new_field
   ```

## Vercel Deployment

The configured build script will automatically:
1. Run `npx prisma migrate deploy` to apply pending migrations directly
2. Generate the Prisma client
3. Build your Nuxt application

## Database Commands

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Create a new migration after schema changes
npx prisma migrate dev --name your_change_name

# Apply all pending migrations
npx prisma migrate deploy

# Reset database (caution: deletes all data)
npx prisma migrate reset

# Open Prisma Studio to view/edit data
npx prisma studio
```

## Troubleshooting

### "Database already exists" error
- This can happen if you're trying to create a database that already exists
- Solution: Skip the database creation step or use a different database name

### "Schema drift detected" error
- This happens when the database schema doesn't match the migration history
- Solution: Use `prisma migrate reset` locally or manually fix schema differences

### Connection issues
- Check if your PostgreSQL server is running
- Verify credentials in connection string
- For Neon, ensure your IP is allowed in the connection policies 