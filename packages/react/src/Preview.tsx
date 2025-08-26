import DOMPurify from 'dompurify';
import type { PreviewProps } from './types';
import { renderToHtml } from './renderToHtml';

export function Preview({ data, className }: PreviewProps) {
  const rawHtml = renderToHtml(data);
  const clean = DOMPurify.sanitize(rawHtml, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
  });
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />
  );
}
