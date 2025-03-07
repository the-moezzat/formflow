// app/api/get-form/[formId]/route.ts
import { NextResponse } from 'next/server';
import { database } from '@repo/database';

export async function GET(
  request: Request,
  { params }: { params: { formId: string } }
) {
  const formId = params.formId;

  try {
    const formData = await database.form.findUnique({
      where: { id: formId },
      select: { encodedForm: true },
    });

    return NextResponse.json({
      encodedForm: formData?.encodedForm || null,
    });
  } catch (error) {
    console.error('Error fetching form:', error);
    return NextResponse.json({ encodedForm: null }, { status: 500 });
  }
}
