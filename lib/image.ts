/**
 * Utility functions for handling client-side image compression and metadata extraction.
 */

export interface ImageDimensions {
  width: number;
  height: number;
}

export function getImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !file.type.startsWith("image/")) {
      return resolve({ width: 0, height: 0 });
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: 0, height: 0 });
    };

    img.src = url;
  });
}

/**
 * Compresses an image file client-side to WebP if supported, or reduces canvas dimensions.
 * Skips animated GIFs and SVGs to preserve fidelity.
 */
export async function compressImage(
  file: File,
  options: { maxWidth?: number; maxHeight?: number; quality?: number } = {}
): Promise<File> {
  const { maxWidth = 1920, maxHeight = 1080, quality = 0.82 } = options;

  // Don't touch SVGs or animated GIFs
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  // If file is already tiny (< 150KB), don't waste CPU
  if (file.size < 150 * 1024 && file.type === "image/webp") {
    return file;
  }

  if (typeof window === "undefined") {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let width = img.naturalWidth;
      let height = img.naturalHeight;

      // Calculate aspect ratio scaling
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(file);

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            // If compressed version is somehow larger than original, stick with original
            return resolve(file);
          }

          const baseName = file.name.replace(/\.[^/.]+$/, "");
          const compressedFile = new File([blob], `${baseName}.webp`, {
            type: "image/webp",
            lastModified: Date.now(),
          });

          resolve(compressedFile);
        },
        "image/webp",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function extractClipboardImages(e: ClipboardEvent): File[] {
  const items = e.clipboardData?.items;
  if (!items) return [];

  const images: File[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.type.startsWith("image/")) {
      const file = item.getAsFile();
      if (file) {
        // Name clipboard pastes with readable timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
        const renamed = new File([file], `paste_${timestamp}.png`, {
          type: file.type,
          lastModified: Date.now(),
        });
        images.push(renamed);
      }
    }
  }
  return images;
}

export async function extractDominantColor(file: File): Promise<string> {
  if (typeof window === "undefined" || !file.type.startsWith("image/")) {
    return "#1e293b";
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve("#1e293b");

        ctx.drawImage(img, 0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        resolve(hex);
      } catch {
        resolve("#1e293b");
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve("#1e293b");
    };

    img.src = url;
  });
}

export function calculateSmartCrop(
  width: number,
  height: number,
  targetAspect = 16 / 9
): { sx: number; sy: number; sWidth: number; sHeight: number } {
  const currentAspect = width / height;
  if (currentAspect > targetAspect) {
    const sWidth = height * targetAspect;
    return {
      sx: (width - sWidth) / 2,
      sy: 0,
      sWidth,
      sHeight: height,
    };
  } else {
    const sHeight = width / targetAspect;
    return {
      sx: 0,
      sy: (height - sHeight) / 2,
      sWidth: width,
      sHeight,
    };
  }
}
