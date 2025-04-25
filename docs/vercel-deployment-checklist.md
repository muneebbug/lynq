# Vercel Deployment Troubleshooting

## Environment Variables
Make sure you have the following environment variables set in your Vercel project:

- `DATABASE_URL`: Your Neon database connection string 
- `NODE_ENV`: Should be set to "production"

## Vercel Build Command
The default build command in Vercel should match the one in your package.json:
```
npx prisma migrate deploy && prisma generate && nuxt build
```

## Troubleshooting Steps

1. **Check Deployment Logs**
   - Go to your Vercel dashboard
   - Click on your project
   - Go to "Deployments" tab
   - Click on the latest deployment
   - Look for any errors in the build logs, especially during the migration step

2. **Test Database Connection**
   - Verify your database URL is correctly specified in Vercel
   - Ensure your Neon database allows connections from Vercel's IP range (check Neon's IP access settings)

3. **Check Migration Status**
   - You can check migration status directly in Neon console or by running:
     ```
     DATABASE_URL=your_production_url npx prisma migrate status
     ```

4. **Manual Migration Application**
   If migrations aren't running automatically:
   - Run migrations manually with:
     ```
     DATABASE_URL=your_production_url npx prisma migrate deploy
     ```

5. **Prisma Schema Generation**
   - Ensure Prisma client is being generated:
     ```
     prisma generate
     ```

6. **Check Build Order**
   - Migrations must run before the application builds
   - The order in package.json should be:
     1. prisma migrate deploy
     2. prisma generate
     3. nuxt build

## Specific Vercel Settings

1. Go to your project in Vercel dashboard
2. Click "Settings" → "General"
3. Make sure "Build Command" matches your package.json's build script
4. Verify "Install Command" is set correctly for your package manager (e.g., `pnpm install`) 

## Common Issues with Neon DB

### Connection Pooling
Neon recommends using their connection pooling for serverless environments like Vercel:

1. In your Neon dashboard, go to your project
2. Navigate to the "Connection Details" section
3. Switch to "Pooled connection"
4. Copy the connection string that includes the pooler
5. Update your DATABASE_URL in Vercel with this pooled connection string

### Neon IP Access
Make sure your Neon database allows connections from Vercel's deployment infrastructure:

1. In Neon dashboard, go to your project settings
2. Navigate to "Access Control"
3. Either enable "Allow from anywhere" or add Vercel's IP ranges (check Vercel documentation for current IP ranges)

### SSL Requirements
Neon requires SSL connections which are enabled by default in the connection string. Make sure your DATABASE_URL contains `sslmode=require` if you're having connection issues.

### Initial Migration Issues
If this is your first deployment and migrations aren't running:

1. Create the initial migration locally:
   ```
   npx prisma migrate dev --name init
   ```

2. Make sure to commit the migration files to your repository

3. Redeploy your application on Vercel

4. If it still fails, you can try:
   ```
   DATABASE_URL=your_production_url npx prisma db push
   ```
   Note: `db push` is useful for initial setup but migrations are better for production 