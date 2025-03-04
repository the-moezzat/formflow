'use server';

import { decodeJsonData } from '@/utils/formEncoder';
import { database } from '@repo/database';

// Define a more specific type for form response data
type FormResponseData = Record<string, unknown>;

export async function fetchFormResponses(formId: string) {
  try {
    // Example implementation - adjust based on your database
    const responses = await database.formResponse.findMany({
      where: {
        formId: formId,
      },
    });

    const decodedResponses = responses.map((response) => {
      return decodeJsonData<FormResponseData>(response.encodedResponse);
    });

    console.log('Fetched form responses:', decodedResponses);
    return decodedResponses;
  } catch (error) {
    console.error('Error fetching form responses:', error);
    throw new Error('Failed to fetch form responses');
  }
}
