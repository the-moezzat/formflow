# Database Package

This package contains the database schema, migrations, and services for FormFlow.

## Overview

We use [Drizzle ORM](https://orm.drizzle.team/) for database interactions, which provides:
- Type-safe database operations
- Schema management
- Migration support

## Local Development

### Setup

1. Ensure you have a PostgreSQL database running locally or access to a remote database
2. Set up your environment variables in a `.env` file at the project root:

```
DATABASE_URL=postgres://username:password@localhost:5432/formflow
```

### Commands

Run these commands from the root of the monorepo:

- Generate migrations based on schema changes:
  ```
  pnpm db:generate
  ```

- Run migrations to update database:
  ```
  pnpm db:migrate
  ```

- Push schema changes directly (alternative to migrations):
  ```
  pnpm db:push
  ```

## CI/CD Pipeline

We have an automated GitHub Actions workflow for applying database changes to staging and production environments.

### How It Works

1. When code is pushed to `staging` or `main` branches with changes in the `packages/database` directory, the workflow is triggered
2. The workflow runs `pnpm db:push --filter database` to apply schema changes to the corresponding environment

### Setup Requirements

For the GitHub workflow to function properly, set up the following secrets in your GitHub repository:

- `DATABASE_URL`: Complete connection string (can be used instead of individual parameters)
- `DATABASE_USER`: Database username
- `DATABASE_PASSWORD`: Database password
- `DATABASE_HOST`: Database host address
- `DATABASE_PORT`: Database port
- `DATABASE_NAME`: Database name

### Environments

Configure two environments in GitHub:
1. **staging**: For the staging database
2. **production**: For the production database

Set environment-specific secrets for each environment.

## Best Practices

1. Always test migrations locally before pushing to the repository
2. Use `db:generate` to create proper migrations when making schema changes
3. Review migration files before committing them
4. For significant schema changes, consider coordinating with team members
5. Monitor the GitHub Actions workflow to ensure successful migrations

## Troubleshooting

If migrations fail in the CI/CD pipeline:

1. Check the GitHub Actions logs for specific errors
2. Verify that your database credentials are correct in GitHub secrets
3. Try running the migration locally with the same database connection
4. If needed, make a new commit with fixed migration files 