ALTER TABLE "Page" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "Page" CASCADE;--> statement-breakpoint
ALTER TABLE "FormResponse" DROP CONSTRAINT "FormResponse_formId_Form_id_fk";
--> statement-breakpoint
ALTER TABLE "FormResponse" ADD CONSTRAINT "FormResponse_formId_Form_id_fk" FOREIGN KEY ("formId") REFERENCES "public"."Form"("id") ON DELETE cascade ON UPDATE cascade;