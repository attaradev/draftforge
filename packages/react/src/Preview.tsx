import DOMPurify from 'dompurify';
import { useEffect, useMemo, useState } from 'react';
import type { PreviewProps } from './types';
import { renderToHtml } from './renderToHtml';

export function Preview({ data, className, page = 1, pageSize }: PreviewProps) {
  const rawHtml = useMemo(
    () => renderToHtml(data, { page, pageSize }),
    [data, page, pageSize]
  );
  const [html, setHtml] = useState('');

  useEffect(() => {
    let cancelled = false;
    const work = () => {
      const clean = DOMPurify.sanitize(rawHtml, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
      });
      if (!cancelled) setHtml(clean);
    };
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = (window as any).requestIdleCallback(work);
      return () => {
        cancelled = true;
        (window as any).cancelIdleCallback(id);
      };
    }
    const id = setTimeout(work, 0);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [rawHtml]);

  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
