import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { auth, db } from 'src/boot/firebase';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { initializeDefaultCategories } from 'src/utils/categoryInitializer';

/**
 * Authentication service wrapper for Firebase Authentication
 * Provides methods for user authentication and account management
 */
export interface AuthService {
  register(email: string, password: string): Promise<UserCredential>;
  login(email: string, password: string): Promise<UserCredential>;
  logout(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  getCurrentUser(): User | null;
  onAuthStateChange(callback: (user: User | null) => void): () => void;
}

/**
 * Firebase implementation of the AuthService interface
 */
export class FirebaseAuthService implements AuthService {
  /**
   * Register a new user with email and password
   * @param email User's email address
   * @param password User's password
   * @returns Promise resolving to UserCredential
   */
  async register(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Create user profile in Firestore
      const user = userCredential.user;
      const now = Timestamp.now();

      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        settings: {
          currency: 'USD',
          locale: 'en-US',
          theme: 'light',
          notifications: {
            email: true,
            push: true,
            budgetAlerts: true
          }
        },
        createdAt: now,
        updatedAt: now
      });

      // Initialize default categories for the new user
      await initializeDefaultCategories(user.uid);

      return userCredential;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }

  /**
   * Log in an existing user with email and password
   * @param email User's email address
   * @param password User's password
   * @returns Promise resolving to UserCredential
   */
  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  /**
   * Log out the current user
   * @returns Promise resolving when logout is complete
   */
  logout(): Promise<void> {
    return signOut(auth);
  }

  /**
   * Send a password reset email to the user
   * @param email User's email address
   * @returns Promise resolving when the email is sent
   */
  resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(auth, email);
  }

  /**
   * Get the current authenticated user
   * @returns The current user or null if not authenticated
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Listen for authentication state changes
   * @param callback Function to call when auth state changes
   * @returns Unsubscribe function to stop listening
   */
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }
}

// Create and export a singleton instance of the auth service
export const authService = new FirebaseAuthService();
export default authService;
