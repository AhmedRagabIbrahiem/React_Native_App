const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "";

function getUrl(path: string): string {
  if (!API_BASE_URL) {
    throw new Error(
      "EXPO_PUBLIC_API_URL is not set. Example: http://localhost:3000"
    );
  }
  return `${API_BASE_URL.replace(/\/$/, "")}${path}`;
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(getUrl(path));
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(getUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
