import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { nanoid } from 'nanoid';
import { optimizeImage } from '../utils/image-optimizer';

const storage = getStorage();
const auth = getAuth();

export interface UploadProgressCallback {
  (progress: number): void;
}

export interface ReceiptMetadata {
  userId: string;
  expenseId: string;
  originalName: string;
  contentType: string;
  size: number;
  uploadedAt: string;
  width: number;
  height: number;
  thumbnailPath?: string | undefined;
}

export class StorageService {
  private static getUserReceiptsPath(userId: string): string {
    return `receipts/${userId}`;
  }

  static async uploadReceipt(
    file: File,
    expenseId: string,
    onProgress?: UploadProgressCallback
  ): Promise<{
    downloadUrl: string;
    thumbnailUrl: string | undefined;
    metadata: ReceiptMetadata
  }> {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('User must be authenticated to upload receipts');
    }

    // Optimize image and generate thumbnail
    const optimized = await optimizeImage(file);

    // Generate unique filenames
    const fileExtension = 'jpg'; // We convert all images to JPEG
    const uniqueId = nanoid();
    const filename = `${expenseId}_${uniqueId}.${fileExtension}`;
    const filePath = `${this.getUserReceiptsPath(userId)}/${filename}`;

    // Create storage references
    const storageRef = ref(storage, filePath);
    let thumbnailPath: string | undefined;
    let thumbnailUrl: string | undefined;

    // Upload the optimized file
    const uploadTask = uploadBytesResumable(storageRef, optimized.file, {
      customMetadata: {
        userId,
        expenseId,
        originalName: file.name,
        width: optimized.width.toString(),
        height: optimized.height.toString(),
      },
    });

    // Set up progress tracking if callback provided
    if (onProgress) {
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes);
          onProgress(progress);
        }
      );
    }

    // Wait for upload to complete
    await uploadTask;

    // Upload thumbnail if available
    if (optimized.thumbnail) {
      const thumbFilename = `thumb_${filename}`;
      thumbnailPath = `${this.getUserReceiptsPath(userId)}/${thumbFilename}`;
      const thumbRef = ref(storage, thumbnailPath);
      await uploadBytesResumable(thumbRef, optimized.thumbnail);
      thumbnailUrl = await getDownloadURL(thumbRef);
    }

    // Get download URL
    const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

    // Create metadata object
    const metadata: ReceiptMetadata = {
      userId,
      expenseId,
      originalName: file.name,
      contentType: optimized.file.type,
      size: optimized.file.size,
      uploadedAt: new Date().toISOString(),
      width: optimized.width,
      height: optimized.height,
      thumbnailPath,
    };

    return { downloadUrl, thumbnailUrl, metadata };
  }

  static async deleteReceipt(filePath: string): Promise<void> {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('User must be authenticated to delete receipts');
    }

    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);

    // Delete thumbnail if it exists
    const thumbPath = filePath.replace(/([^/]+)$/, 'thumb_$1');
    try {
      const thumbRef = ref(storage, thumbPath);
      await deleteObject(thumbRef);
    } catch {
      // Ignore errors if thumbnail doesn't exist
    }
  }

  static async listUserReceipts(userId: string): Promise<string[]> {
    const receiptsRef = ref(storage, this.getUserReceiptsPath(userId));
    const result = await listAll(receiptsRef);
    return result.items.map(item => item.fullPath);
  }
}

export default StorageService;
