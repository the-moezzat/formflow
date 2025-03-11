// app/api/get-form/[formId]/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { database, eq } from "@repo/database";
import { form } from "@repo/database/schema";

export async function GET(request: NextRequest) {
  const formId = request.nextUrl.pathname.split("/").pop();
  console.log("----Form ID", formId);
  if (!formId) {
    return NextResponse.json({ error: "Missing form ID" }, { status: 400 });
  }

  try {
    const [formData] = await database
      .select()
      .from(form)
      .where(eq(form.id, formId));

    console.log("----Form response", formData);

    if (!formData) {
      return NextResponse.json({ encodedForm: null }, { status: 404 });
    }

    return NextResponse.json({ form: formData });
  } catch (error) {
    return NextResponse.json({ encodedForm: null }, { status: 500 });
  }
}
