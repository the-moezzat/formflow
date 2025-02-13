import { log } from '@repo/observability/log';

// utils/formEncoder.ts
import pako from 'pako';

const plusRegex = /\+/g;
const slashRegex = /\//g;
const equalsRegex = /=+$/;

export const encodeJsonData = (formData: object): string => {
  try {
    // 1. Convert to JSON string
    const jsonString = JSON.stringify(formData);

    // 2. Convert string to Uint8Array for compression
    const uint8Array = new TextEncoder().encode(jsonString);

    // 3. Compress the data
    const compressed = pako.deflate(uint8Array);

    // 4. Convert to Base64
    const base64 = btoa(
      String.fromCharCode.apply(null, Array.from(compressed))
    );

    // 5. Make URL-safe
    return base64
      .replace(plusRegex, '-')
      .replace(slashRegex, '_')
      .replace(equalsRegex, '');
  } catch (error) {
    log.error('Error encoding form data:', { error });
    throw new Error('Failed to encode form data');
  }
};

export function decodeJsonData<T>(encodedData: string): T {
  try {
    // 1. Restore Base64 padding
    const base64 = encodedData.replace(/-/g, '+').replace(/_/g, '/');
    const padding = base64.length % 4;
    const paddedBase64 = padding ? base64 + '='.repeat(4 - padding) : base64;

    // 2. Convert Base64 to binary
    const binary = atob(paddedBase64);

    // 3. Convert binary string to Uint8Array
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    // 4. Decompress
    const decompressed = pako.inflate(bytes);

    // 5. Convert back to string and parse JSON
    const jsonString = new TextDecoder().decode(decompressed);
    return JSON.parse(jsonString);
  } catch (error) {
    log.error('Error decoding form data:', { error });
    throw new Error('Failed to decode form data');
  }
}

// Usage example to see size difference
export const testCompression = (formData: object) => {
  const originalJSON = JSON.stringify(formData);
  const encoded = encodeJsonData(formData);

  console.log('Original length:', originalJSON.length);
  console.log('Encoded length:', encoded.length);
  console.log(
    'Compression ratio:',
    (encoded.length / originalJSON.length) * 100
  );

  // Test roundtrip
  const decoded = decodeJsonData(encoded);
  console.log(
    'Roundtrip successful:',
    JSON.stringify(decoded) === originalJSON
  );

  return encoded;
};
