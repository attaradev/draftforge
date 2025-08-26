import { useState } from 'react';
import type { ExportButtonProps } from './types';
import { renderToHtml } from './renderToHtml';

export function ExportButton({ data, filename = 'document.pdf', exportUrl, pollBaseUrl, onReady, className }: ExportButtonProps) {
  const [status, setStatus] = useState<'idle'|'submitting'|'processing'|'ready'|'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const kick = async () => {
    setStatus('submitting');
    setError(null);
    try {
      const html = renderToHtml(data);
      const res = await fetch(exportUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_html: html, filename })
      });
      if (!res.ok) throw new Error(`Export request failed: ${res.status}`);
      const { id } = await res.json();
      setStatus('processing');
      let tries = 0;
      while (tries < 60) {
        await new Promise(r => setTimeout(r, 1000));
        const sres = await fetch(`${pollBaseUrl}/${id}`, { method: 'GET' });
        if (!sres.ok) throw new Error(`Poll failed: ${sres.status}`);
        const data = await sres.json();
        if (data.status === 'complete' && data.download_url) {
          setStatus('ready');
          onReady?.(data.download_url);
          return;
        } else if (data.status === 'failed') {
          throw new Error('Export failed');
        }
        tries++;
      }
      throw new Error('Timed out waiting for export');
    } catch (e: any) {
      setError(e?.message || 'Unexpected error');
      setStatus('error');
    }
  };

  return (
    <div className={className}>
      <button onClick={kick} disabled={status==='submitting' || status==='processing'}>
        {status === 'processing' ? 'Exporting…' : 'Export PDF'}
      </button>
      {status === 'error' && <div style={{ color: 'crimson' }}>Export error: {error}</div>}
    </div>
  );
}
