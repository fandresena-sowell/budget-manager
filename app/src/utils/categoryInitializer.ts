import { firestoreService } from 'src/services';
import { DEFAULT_CATEGORIES } from 'src/models/CategoryModel';
import type { Category } from 'src/models';

/**
 * Initializes default categories for a new user
 * @param userId The ID of the user to create categories for
 * @returns A promise that resolves when all categories are created
 */
export async function initializeDefaultCategories(userId: string): Promise<void> {
  try {
    console.log(`Initializing default categories for user ${userId}`);

    // Get existing categories for the user to avoid duplicates
    const existingCategories = await firestoreService.getDocumentsWhere<Category>(
      'categories',
      'userId',
      '==',
      userId
    );

    // Only create default categories if user has no categories yet
    if (existingCategories.length === 0) {
      // Create default categories using batch operation
      const createPromises = DEFAULT_CATEGORIES.map(async (category) => {
        await firestoreService.createDocument('categories', {
          ...category,
          userId
        });
      });

      await Promise.all(createPromises);
      console.log(`Successfully created ${DEFAULT_CATEGORIES.length} default categories for user ${userId}`);
    } else {
      console.log(`User ${userId} already has categories, skipping initialization`);
    }
  } catch (error) {
    console.error('Error initializing default categories:', error);
    throw error;
  }
}
