"use server";

import { decodeJsonData } from "@/utils/formEncoder";
import { database, eq } from "@repo/database";
import { formResponse } from "@repo/database/schema";

// Define a more specific type for form response data
type FormResponseData = Record<string, unknown>;

export async function fetchFormResponses(formId: string) {
  try {
    // Use Drizzle's query builder to fetch responses
    const responses = await database
      .select()
      .from(formResponse)
      .where(eq(formResponse.formId, formId));

    const decodedResponses = responses.map((response) => {
      return decodeJsonData<FormResponseData>(response.encodedResponse);
    });
    return decodedResponses;
  } catch (error) {
    console.error("Error fetching form responses:", error);
    throw new Error("Failed to fetch form responses");
  }
}
