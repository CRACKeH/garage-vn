/** Derive a public/ URL path from a picked image filename. */
export function publicPathFromFileName(
  fileName: string,
  fallbackChapterId?: string,
): string {
  const base = fileName.split(/[/\\]/).pop() ?? fileName;
  const match = /^ch(\d{2})[-_]/i.exec(base);
  if (match) {
    return `/chapter${match[1]}/${base}`;
  }
  if (fallbackChapterId) {
    const id = fallbackChapterId.padStart(2, "0").slice(-2);
    return `/chapter${id}/${base}`;
  }
  return `/${base}`;
}

type OpenFilePickerWindow = Window & {
  showOpenFilePicker?: (options?: {
    multiple?: boolean;
    types?: Array<{
      description?: string;
      accept: Record<string, string[]>;
    }>;
  }) => Promise<Array<{ getFile: () => Promise<File> }>>;
};

/**
 * Opens the native file dialog (Finder on macOS) and returns a public asset path.
 * Browser cannot reveal absolute disk paths — pick a file already under `public/`.
 */
export async function pickImagePublicPath(
  fallbackChapterId?: string,
): Promise<string | null> {
  const w = window as OpenFilePickerWindow;

  if (typeof w.showOpenFilePicker === "function") {
    try {
      const [handle] = await w.showOpenFilePicker({
        multiple: false,
        types: [
          {
            description: "Images",
            accept: {
              "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"],
            },
          },
        ],
      });
      const file = await handle.getFile();
      return publicPathFromFileName(file.name, fallbackChapterId);
    } catch (err) {
      // User cancelled
      if (err instanceof DOMException && err.name === "AbortError") return null;
      // Fall through to input fallback
    }
  }

  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg,image/webp,image/gif,.png,.jpg,.jpeg,.webp,.gif";
    input.style.display = "none";
    const cleanup = () => {
      input.remove();
    };
    input.addEventListener("change", () => {
      const file = input.files?.[0];
      cleanup();
      if (!file) {
        resolve(null);
        return;
      }
      resolve(publicPathFromFileName(file.name, fallbackChapterId));
    });
    input.addEventListener("cancel", () => {
      cleanup();
      resolve(null);
    });
    document.body.appendChild(input);
    input.click();
  });
}
