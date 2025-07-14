export function splitIntoChunks(text: string, maxLen: number): string[] {
    const result: string[] = [];
  
    for (let i = 0; i < text.length; i += maxLen) {
      result.push(text.substring(i, i + maxLen));
    }
  
    return result;
  }
  