CREATE TYPE "public"."style" AS ENUM('card', 'multiple');--> statement-breakpoint
ALTER TABLE "Form" ADD COLUMN "style" "style" DEFAULT 'multiple';