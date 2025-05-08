import {
  boolean,
  foreignKey,
  index,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

export const form = pgTable("Form", {
  id: text().primaryKey().notNull(),
  userId: text().notNull(),
  title: text().notNull(),
  encodedForm: text().notNull(),
  formHistory: text().array(),
  currentVersion: integer().default(1).notNull(),
  createdAt: timestamp({ precision: 3, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
  viewCount: integer().default(0).notNull(),
  responseCount: integer().default(0).notNull(),
});

export const formResponse = pgTable(
  "FormResponse",
  {
    id: text().primaryKey().notNull(),
    formId: text().notNull(),
    formVersion: integer().notNull(),
    encodedResponse: text().notNull(),
    submittedAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    submitterIp: text(),
    userAgent: text(),
  },
  (table) => [
    index("FormResponse_formId_idx").using(
      "btree",
      table.formId.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.formId],
      foreignColumns: [form.id],
      name: "FormResponse_formId_Form_id_fk",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ],
);

export const user = pgTable("user", {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  isAnonymous: boolean('is_anonymous'),
});

export const session = pgTable("session", {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
  activeOrganizationId: text('active_organization_id'),
});

export const account = pgTable("account", {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const verification = pgTable("verification", {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

export const organization = pgTable("organization", {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique(),
  logo: text('logo'),
  createdAt: timestamp('created_at').notNull(),
  metadata: text('metadata'),
});

export const member = pgTable("member", {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').notNull().references(()=> organization.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  teamId: text('team_id'),
  createdAt: timestamp('created_at').notNull(),
});

export const invitation = pgTable("invitation", {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').notNull().references(()=> organization.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: text('role'),
  teamId: text('team_id'),
  status: text('status').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  inviterId: text('inviter_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
});

export const team = pgTable("team", {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  organizationId: text('organization_id').notNull().references(()=> organization.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
  icon: text('icon')
});
