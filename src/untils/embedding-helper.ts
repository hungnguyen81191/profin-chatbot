import axios from 'axios';

export async function getEmbedding(text: string, apiKey: string): Promise<number[]> {
  const res = await axios.post(
    'https://api.openai.com/v1/embeddings',
    {
      input: text,
      model: 'text-embedding-3-small',
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    },
  );

  return res.data.data[0].embedding;
}
