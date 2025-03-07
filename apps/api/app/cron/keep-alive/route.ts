import { database, eq } from "@repo/database";
import { form } from "@repo/database/schema";

export const GET = async () => {
  const [newForm] = await database.insert(form).values({
    id: crypto.randomUUID(),
    userId: "cron-user",
    title: "cron-temp",
    encodedForm: JSON.stringify({}),
    updatedAt: new Date().toISOString(),
  }).returning();

  await database.delete(form).where(eq(form.id, newForm.id));
  return new Response("OK", { status: 200 });
};
