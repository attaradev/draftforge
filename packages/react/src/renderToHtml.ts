import type { EditorJsData, RenderOptions } from './types';

/** Minimal Renderer: Editor.js JSON -> HTML string */
export function renderToHtml(
  data: EditorJsData,
  opts: RenderOptions = {}
): string {
  if (!data || !Array.isArray(data.blocks)) return '';
  const { page = 1, pageSize } = opts;
  const start = pageSize ? (page - 1) * pageSize : 0;
  const end = pageSize ? start + pageSize : undefined;
  const blocks = pageSize ? data.blocks.slice(start, end) : data.blocks;
  const parts: string[] = [];
  for (const block of blocks) {
    const { type, data, editable } = block || {};
    const ceAttr =
      editable === undefined ? '' : ` contenteditable="${editable ? 'true' : 'false'}"`;
    switch (type) {
      case 'paragraph': {
        parts.push(`<p${ceAttr}>${escapeHtml(data?.text ?? '')}</p>`);
        break;
      }
      case 'header': {
        const level = clamp(Number(data?.level) || 2, 1, 6);
        parts.push(`<h${level}${ceAttr}>${escapeHtml(data?.text ?? '')}</h${level}>`);
        break;
      }
      case 'list': {
        const style = (data?.style === 'ordered') ? 'ol' : 'ul';
        const items = Array.isArray(data?.items) ? data.items : [];
        const lis = items.map((t: string) => `<li>${escapeHtml(t)}</li>`).join('');
        parts.push(`<${style}${ceAttr}>${lis}</${style}>`);
        break;
      }
      case 'checklist': {
        const items = Array.isArray(data?.items) ? data.items : [];
        const lis = items.map((it: any) => {
          const checked = it?.checked ? '☑' : '☐';
          return `<li>${checked} ${escapeHtml(it?.text ?? '')}</li>`;
        }).join('');
        parts.push(`<ul class="checklist"${ceAttr}>${lis}</ul>`);
        break;
      }
      case 'table': {
        const rows: string[][] = Array.isArray(data?.content) ? data.content : [];
        const trs = rows.map((row: string[]) => {
          const tds = row.map((cell: string) => `<td>${escapeHtml(cell)}</td>`).join('');
          return `<tr>${tds}</tr>`;
        }).join('');
        parts.push(`<table${ceAttr}>${trs}</table>`);
        break;
      }
      case 'quote': {
        const text = escapeHtml(data?.text ?? '');
        const caption = data?.caption ? `<cite>${escapeHtml(data.caption)}</cite>` : '';
        parts.push(`<blockquote${ceAttr}>${text}${caption}</blockquote>`);
        break;
      }
      case 'code': {
        const code = escapeHtml(data?.code ?? '');
        parts.push(`<pre${ceAttr}><code>${code}</code></pre>`);
        break;
      }
      case 'delimiter': {
        parts.push(`<hr${ceAttr} />`);
        break;
      }
      case 'image': {
        const url = data?.file?.url || data?.url;
        if (typeof url === 'string' && url.length > 0) {
          const caption = data?.caption ? `<figcaption>${escapeHtml(data.caption)}</figcaption>` : '';
          parts.push(`<figure${ceAttr}><img src="${escapeAttr(url)}" alt="" />${caption}</figure>`);
        }
        break;
      }
      default: {
        break;
      }
    }
  }
  return parts.join('\n');
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
function escapeAttr(s: string) {
  return escapeHtml(s).replace(/`/g, '&#96;');
}
