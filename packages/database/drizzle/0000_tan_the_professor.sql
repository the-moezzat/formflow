-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "Page" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Form" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"title" text NOT NULL,
	"encodedForm" text NOT NULL,
	"formHistory" text[],
	"currentVersion" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"viewCount" integer DEFAULT 0 NOT NULL,
	"responseCount" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "FormResponse" (
	"id" text PRIMARY KEY NOT NULL,
	"formId" text NOT NULL,
	"formVersion" integer NOT NULL,
	"encodedResponse" text NOT NULL,
	"submittedAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"submitterIp" text,
	"userAgent" text
);
--> statement-breakpoint
CREATE INDEX "FormResponse_formId_idx" ON "FormResponse" USING btree ("formId" text_ops);
*/