/**
 * Encodes an ID to a base64 string for URL safety
 * @param id - The ID to encode (number)
 * @returns Encoded base64 string
 */
export const encodeId = (id: number | string): string => {
  try {
    // Convert to string and encode
    return btoa(id.toString());
  } catch (error) {
    console.error("Error encoding ID:", error);
    return id.toString();
  }
};

/**
 * Decodes a base64 encoded ID back to its original number
 * @param encodedId - The base64 encoded ID
 * @returns Decoded ID as number or null if decoding fails
 */
export const decodeIdToNumber = (
  encodedId: string | undefined,
): number | null => {
  if (!encodedId) return null;

  try {
    // Direct decode without padding manipulation
    const decoded = atob(encodedId);
    const num = parseInt(decoded, 10);
    return isNaN(num) ? null : num;
  } catch (error) {
    console.error("Error decoding ID:", error);
    return null;
  }
};
