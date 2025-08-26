import { exportDocument } from '../src/exportDocument';

describe('exportDocument', () => {
  it('resolves with download url', async () => {
    const calls: any[] = [];
    const fetchImpl = (async (url: any, opts?: any) => {
      calls.push({ url, opts });
      if (calls.length === 1) {
        return { ok: true, json: async () => ({ id: '1' }) } as any;
      }
      return { ok: true, json: async () => ({ status: 'complete', download_url: '/file.pdf' }) } as any;
    }) as any;
    const url = await exportDocument({
      data: { blocks: [] },
      exportUrl: '/export',
      pollBaseUrl: '/status',
      fetchImpl,
      pollIntervalMs: 0
    });
    expect(url).toBe('/file.pdf');
    expect(calls[0].url).toBe('/export');
  });

  it('throws on export failure', async () => {
    const fetchImpl = (async (url: any, opts?: any) => {
      if (url === '/export') {
        return { ok: true, json: async () => ({ id: '1' }) } as any;
      }
      return { ok: true, json: async () => ({ status: 'failed' }) } as any;
    }) as any;
    await expect(exportDocument({
      data: { blocks: [] },
      exportUrl: '/export',
      pollBaseUrl: '/status',
      fetchImpl,
      pollIntervalMs: 0,
      maxPolls: 1
    })).rejects.toThrow('Export failed');
  });
});
