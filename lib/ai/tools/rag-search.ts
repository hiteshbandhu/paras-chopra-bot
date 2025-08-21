import { tool } from 'ai';
import { z } from 'zod';
import { CloudClient } from 'chromadb';

// Initialize ChromaDB client
const client = new CloudClient({
  apiKey: process.env.CHROMA_API_KEY,
  tenant: process.env.CHROMA_TENANT_ID,
  database: process.env.CHROMA_DATABASE_NAME || 'Paras Chopra Essays',
});

// Initialize embedding function dynamically
let embeddingFunction: any = null;

async function getEmbeddingFunction() {
  if (!embeddingFunction) {
    const { DefaultEmbeddingFunction } = await import(
      '@chroma-core/default-embed'
    );
    embeddingFunction = new DefaultEmbeddingFunction();
  }
  return embeddingFunction;
}

export const ragSearch = tool({
  description:
    'Search for relevant documents from the essays collection using ChromaDB to perform Retrieval-Augmented Generation (RAG). This tool retrieves the top 3 most relevant documents based on the query using semantic search. Returns both documents and their metadata including source links.',
  inputSchema: z.object({
    query: z.string().describe('The search query to find relevant documents'),
  }),
  execute: async ({ query }) => {
    try {
      // Get embedding function
      const embeddingFunc = await getEmbeddingFunction();

      // Access the 'essays' collection with embedding function
      const collection = await client.getCollection({
        name: 'essays',
        embeddingFunction: embeddingFunc,
      });

      // Perform semantic search to retrieve the top 3 relevant documents with metadata
      const results = await collection.query({
        queryTexts: [query],
        nResults: 3,
        include: ['documents', 'metadatas'],
      });

      // Extract documents and metadata
      const documents = results.documents[0];
      const metadatas = results.metadatas?.[0];

      if (!documents || documents.length === 0) {
        return {
          documents: [],
          metadatas: [],
          message: 'No relevant documents found for the query.',
          query: query,
        };
      }

      return {
        documents: documents,
        metadatas: metadatas || [],
        message: `Found ${documents.length} relevant documents for your query.`,
        query: query,
      };
    } catch (error) {
      console.error('Error retrieving documents:', error);
      return {
        error: 'Failed to retrieve documents from ChromaDB',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});
