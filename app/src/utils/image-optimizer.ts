interface OptimizedImage {
  file: File;
  width: number;
  height: number;
  thumbnail?: File;
}

export async function optimizeImage(file: File): Promise<OptimizedImage> {
  // Create a canvas element
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Create an image element
  const img = new Image();
  const imageUrl = URL.createObjectURL(file);

  try {
    // Load the image
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });

    // Get orientation
    const orientation = await getImageOrientation(file);

    // Set proper canvas dimensions
    let width = img.width;
    let height = img.height;

    // Max dimensions for full image
    const MAX_WIDTH = 2048;
    const MAX_HEIGHT = 2048;

    // Scale down if needed
    if (width > MAX_WIDTH || height > MAX_HEIGHT) {
      const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
      width *= ratio;
      height *= ratio;
    }

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Apply orientation fixes
    if (orientation > 1) {
      ctx.save();
      switch (orientation) {
        case 2:
          ctx.transform(-1, 0, 0, 1, width, 0);
          break;
        case 3:
          ctx.transform(-1, 0, 0, -1, width, height);
          break;
        case 4:
          ctx.transform(1, 0, 0, -1, 0, height);
          break;
        case 5:
          ctx.transform(0, 1, 1, 0, 0, 0);
          break;
        case 6:
          ctx.transform(0, 1, -1, 0, height, 0);
          break;
        case 7:
          ctx.transform(0, -1, -1, 0, height, width);
          break;
        case 8:
          ctx.transform(0, -1, 1, 0, 0, width);
          break;
      }
    }

    // Draw image
    ctx.drawImage(img, 0, 0, width, height);

    // Create optimized file
    const optimizedBlob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/jpeg', 0.8);
    });

    const optimizedFile = new File([optimizedBlob], file.name, {
      type: 'image/jpeg',
    });

    // Create thumbnail
    const THUMB_SIZE = 200;
    const thumbRatio = Math.min(THUMB_SIZE / width, THUMB_SIZE / height);
    const thumbWidth = width * thumbRatio;
    const thumbHeight = height * thumbRatio;

    canvas.width = thumbWidth;
    canvas.height = thumbHeight;
    ctx.drawImage(img, 0, 0, thumbWidth, thumbHeight);

    const thumbnailBlob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/jpeg', 0.7);
    });

    const thumbnailFile = new File([thumbnailBlob], `thumb_${file.name}`, {
      type: 'image/jpeg',
    });

    return {
      file: optimizedFile,
      width,
      height,
      thumbnail: thumbnailFile,
    };
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

async function getImageOrientation(file: File): Promise<number> {
  const buffer = await file.arrayBuffer();
  const view = new DataView(buffer);

  if (view.getUint16(0, false) !== 0xFFD8) {
    return 1; // Not a JPEG
  }

  const length = view.byteLength;
  let offset = 2;

  while (offset < length) {
    const marker = view.getUint16(offset, false);
    offset += 2;

    if (marker === 0xFFE1) {
      if (view.getUint32(offset + 2, false) !== 0x45786966) {
        return 1;
      }

      const little = view.getUint16(offset + 8, false) === 0x4949;
      offset += 8;

      const tags = view.getUint16(offset + 2, little);
      offset += 2;

      for (let i = 0; i < tags; i++) {
        if (view.getUint16(offset + (i * 12), little) === 0x0112) {
          return view.getUint16(offset + (i * 12) + 8, little);
        }
      }
    } else if ((marker & 0xFF00) !== 0xFF00) {
      break;
    } else {
      offset += view.getUint16(offset, false);
    }
  }

  return 1;
}
