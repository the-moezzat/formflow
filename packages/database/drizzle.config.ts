import { defineConfig } from 'drizzle-kit';
import { keys } from './keys';

export default defineConfig({
  schema: `${__dirname}/schema.ts`,
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: `${keys().DIRECT_URL}`,
  },
});
