import type { ExportOptions } from './types';

/**
 * Delegate export of Editor.js data to a backend service.
 * Returns the download URL when ready.
 */
export async function exportDocument({
  data,
  filename = 'document.pdf',
  exportUrl,
  pollBaseUrl,
  onReady,
  fetchImpl = fetch,
  pollIntervalMs = 1000,
  maxPolls = 60
}: ExportOptions): Promise<string> {
  const res = await fetchImpl(exportUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content_json: data, filename })
  });
  if (!res.ok) throw new Error(`Export request failed: ${res.status}`);
  const { id } = await res.json();
  let tries = 0;
  while (tries < maxPolls) {
    await new Promise(r => setTimeout(r, pollIntervalMs));
    const sres = await fetchImpl(`${pollBaseUrl}/${id}`);
    if (!sres.ok) throw new Error(`Poll failed: ${sres.status}`);
    const data = await sres.json();
    if (data.status === 'complete' && data.download_url) {
      onReady?.(data.download_url);
      return data.download_url;
    } else if (data.status === 'failed') {
      throw new Error('Export failed');
    }
    tries++;
  }
  throw new Error('Timed out waiting for export');
}
