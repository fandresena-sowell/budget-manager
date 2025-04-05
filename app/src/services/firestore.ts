import { db } from 'src/boot/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  type QueryConstraint,
  type DocumentData,
  type WhereFilterOp,
  type OrderByDirection
} from 'firebase/firestore';

/**
 * Generic options for querying Firestore
 */
export interface QueryOptions<T> {
  filters?: Array<{
    field: keyof T & string;
    operator: WhereFilterOp;
    value: unknown;
  }>;
  orderByField?: keyof T & string;
  orderByDirection?: OrderByDirection;
  limitTo?: number;
}

/**
 * Firestore service wrapper for database operations
 */
class FirestoreService {
  /**
   * Create a document in a collection
   * @param collectionName Name of the collection
   * @param data Data to add to the document
   * @returns Promise resolving to the ID of the created document
   */
  async createDocument<T extends DocumentData>(
    collectionName: string,
    data: T
  ): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: now,
        updatedAt: now
      });
      return docRef.id;
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Create a document with a specific ID
   * @param collectionName Name of the collection
   * @param id ID for the document
   * @param data Data to add to the document
   */
  async createDocumentWithId<T extends DocumentData>(
    collectionName: string,
    id: string,
    data: T
  ): Promise<void> {
    try {
      const now = Timestamp.now();
      const docRef = doc(db, collectionName, id);
      await setDoc(docRef, {
        ...data,
        createdAt: now,
        updatedAt: now
      });
    } catch (error) {
      console.error(`Error creating document with ID in ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Get a document by ID
   * @param collectionName Name of the collection
   * @param id ID of the document
   * @returns Promise resolving to the document data or null if not found
   */
  async getDocument<T>(collectionName: string, id: string): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error getting document from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Update a document by ID
   * @param collectionName Name of the collection
   * @param id ID of the document
   * @param data Data to update in the document
   */
  async updateDocument<T extends DocumentData>(
    collectionName: string,
    id: string,
    data: Partial<T>
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Delete a document by ID
   * @param collectionName Name of the collection
   * @param id ID of the document
   */
  async deleteDocument(collectionName: string, id: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Query documents from a collection
   * @param collectionName Name of the collection
   * @param options Query options
   * @returns Promise resolving to the array of documents
   */
  async queryDocuments<T>(
    collectionName: string,
    options: QueryOptions<T> = {}
  ): Promise<T[]> {
    try {
      const constraints: QueryConstraint[] = [];

      // Add filters if specified
      if (options.filters && options.filters.length > 0) {
        options.filters.forEach((filter) => {
          constraints.push(where(filter.field, filter.operator, filter.value));
        });
      }

      // Add orderBy if specified
      if (options.orderByField) {
        constraints.push(orderBy(options.orderByField, options.orderByDirection || 'asc'));
      }

      // Add limit if specified
      if (options.limitTo) {
        constraints.push(limit(options.limitTo));
      }

      // Create query
      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);

      // Process results
      const results: T[] = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as T);
      });

      return results;
    } catch (error) {
      console.error(`Error querying documents from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Get all documents from a collection
   * @param collectionName Name of the collection
   * @returns Promise resolving to the array of documents
   */
  async getAllDocuments<T>(collectionName: string): Promise<T[]> {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const results: T[] = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as T);
      });
      return results;
    } catch (error) {
      console.error(`Error getting all documents from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Get documents from a collection filtered by a specific field
   * @param collectionName Name of the collection
   * @param field Field to filter by
   * @param value Value to filter for
   * @returns Promise resolving to the array of documents
   */
  async getDocumentsWhere<T>(
    collectionName: string,
    field: string,
    operator: WhereFilterOp,
    value: unknown
  ): Promise<T[]> {
    try {
      const q = query(collection(db, collectionName), where(field, operator, value));
      const querySnapshot = await getDocs(q);
      const results: T[] = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as T);
      });
      return results;
    } catch (error) {
      console.error(`Error getting documents where ${field} ${String(operator)} ${String(value)} from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Get documents from a collection belonging to a user
   * @param collectionName Name of the collection
   * @param userId ID of the user
   * @returns Promise resolving to the array of documents
   */
  async getUserDocuments<T>(collectionName: string, userId: string): Promise<T[]> {
    return this.getDocumentsWhere<T>(collectionName, 'userId', '==', userId);
  }
}

// Create and export a singleton instance of the service
export const firestoreService = new FirestoreService();
