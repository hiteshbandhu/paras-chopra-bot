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

export const essaySearch = tool({
  description:
    'Search for and retrieve a specific essay/document by its ID or title. This tool uses ChromaDB to find essays in the Paras Chopra collection by searching metadata fields.',
  inputSchema: z.object({
    documentId: z
      .string()
      .describe(
        'The unique ID or title of the essay/document to retrieve (e.g., "inverted-passion-2018-in-review")',
      ),
  }),
  execute: async ({ documentId }) => {
    try {
      // Get embedding function
      const embeddingFunc = await getEmbeddingFunction();

      // Access the 'essays' collection with embedding function
      const collection = await client.getCollection({
        name: 'essays',
        embeddingFunction: embeddingFunc,
      });

      // First try to find by exact ID in metadata
      let results = await collection.get({
        where: { id: { $eq: documentId } },
        include: ['documents', 'metadatas'],
      });

      // If not found by ID, try searching by slug
      if (!results.documents || results.documents.length === 0) {
        results = await collection.get({
          where: { slug: { $eq: documentId } },
          include: ['documents', 'metadatas'],
        });
      }

      // If still not found, try searching by URL patterns
      if (!results.documents || results.documents.length === 0) {
        const urlVariants = [
          `invertedpassion.com/${documentId}`,
          documentId,
          documentId.replace(/-/g, ' '),
          documentId
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase()),
        ];

        for (const urlVariant of urlVariants) {
          // Try different metadata fields
          const searchFields = ['url', 'link'];

          for (const field of searchFields) {
            results = await collection.get({
              where: { [field]: { $eq: urlVariant } },
              include: ['documents', 'metadatas'],
            });

            if (results.documents && results.documents.length > 0) {
              break;
            }
          }

          if (results.documents && results.documents.length > 0) {
            break;
          }

          // Also try title match
          results = await collection.get({
            where: { title: { $eq: urlVariant } },
            include: ['documents', 'metadatas'],
          });

          if (results.documents && results.documents.length > 0) {
            break;
          }
        }
      }

      if (!results.documents || results.documents.length === 0) {
        // If not found, let's get a sample of available documents to help debug
        const sampleResults = await collection.get({
          limit: 10,
          include: ['metadatas'],
        });

        const availableDocs =
          sampleResults.metadatas?.map((meta) => ({
            id: meta?.id || 'No ID',
            title: meta?.title || 'No Title',
            slug: meta?.slug || 'No Slug',
            url: meta?.url || meta?.link || 'No URL',
          })) || [];

        return {
          error: 'Document not found',
          message: `No document found with ID or title matching: ${documentId}`,
          documentId: documentId,
          availableDocuments: availableDocs,
          suggestion:
            'Try one of the available document IDs, titles, or slugs listed above',
        };
      }

      // Return the first matching document
      const document = results.documents[0];
      const metadata = results.metadatas?.[0];

      return {
        documentId: documentId,
        title: metadata?.title || 'Unknown Title',
        url: metadata?.link || metadata?.url || 'Unknown URL',
        content: document,
        metadata: metadata,
        message: `Successfully retrieved document: ${metadata?.title || documentId}`,
      };
    } catch (error) {
      console.error('Error retrieving document from ChromaDB:', error);
      return {
        error: 'Failed to retrieve document from ChromaDB',
        details: error instanceof Error ? error.message : 'Unknown error',
        documentId: documentId,
      };
    }
  },
});
