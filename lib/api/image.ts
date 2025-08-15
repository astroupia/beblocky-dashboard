export async function uploadImages(files: File[]): Promise<string[]> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("API URL is not configured");
  }

  // Upload files one by one to Cloudinary endpoint
  const uploadPromises = files.map(async (file) => {
    const form = new FormData();
    // Use 'file' field name as specified in Cloudinary guide
    form.append("file", file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/uploadMedia`,
      {
        method: "POST",
        body: form,
        credentials: "include",
      }
    );

    if (!response.ok) {
      let message = `Failed to upload ${file.name}: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        message = errorData.message || message;
      } catch {}
      throw new Error(message);
    }

    // According to Cloudinary guide, response format is: { "url": "https://..." }
    // Be defensive in case server returns plain text/HTML
    const contentType = response.headers.get("content-type") || "";
    try {
      if (contentType.includes("application/json")) {
        const data = await response.json();
        if (typeof (data as any)?.url === "string") {
          return (data as any).url as string;
        }
        if (
          Array.isArray((data as any)?.urls) &&
          typeof (data as any).urls[0] === "string"
        ) {
          return (data as any).urls[0] as string;
        }
        if (Array.isArray(data) && typeof (data as any)[0] === "string") {
          return (data as any)[0] as string;
        }
        throw new Error(`Invalid JSON response format for ${file.name}`);
      }
      const text = (await response.text()).trim();
      if (text.startsWith("{") || text.startsWith("[")) {
        try {
          const data = JSON.parse(text);
          if (typeof (data as any)?.url === "string")
            return (data as any).url as string;
          if (
            Array.isArray((data as any)?.urls) &&
            typeof (data as any).urls[0] === "string"
          ) {
            return (data as any).urls[0] as string;
          }
          if (Array.isArray(data) && typeof (data as any)[0] === "string") {
            return (data as any)[0] as string;
          }
        } catch {}
      }
      const urlMatch = text.match(/https?:\/\/[^\s"']+/);
      if (urlMatch?.[0]) {
        return urlMatch[0];
      }
      if (text.startsWith("<!DOCTYPE") || text.startsWith("<html")) {
        throw new Error(
          `Received HTML instead of JSON. You might be unauthenticated or redirected. Check CORS/auth for ${file.name}.`
        );
      }
      throw new Error(`Unrecognized response format for ${file.name}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(
        `Failed to parse upload response for ${file.name}: ${message}`
      );
    }
  });

  // Wait for all uploads to complete
  return Promise.all(uploadPromises);
}
