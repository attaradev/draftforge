import { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Checklist from '@editorjs/checklist';
import Table from '@editorjs/table';
import Quote from '@editorjs/quote';
import CodeTool from '@editorjs/code';
import ImageTool from '@editorjs/image';
import type { EditorProps } from './types';

export function Editor({
  initialData,
  onChangeData,
  uploadImage,
  className,
  ariaLabel = 'Rich text editor',
}: EditorProps) {
  const holderRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!holderRef.current) return;

    const editor = new EditorJS({
      holder: holderRef.current,
      data: initialData || { blocks: [{ type: 'paragraph', data: { text: '' } }] },
      tools: {
        paragraph: { inlineToolbar: true },
        header: { class: Header as any, inlineToolbar: true },
        list: { class: List as any, inlineToolbar: true },
        checklist: { class: Checklist as any, inlineToolbar: true },
        table: { class: Table as any, inlineToolbar: true },
        quote: { class: Quote as any, inlineToolbar: true },
        code: { class: CodeTool as any, inlineToolbar: true },
        image: {
          class: ImageTool as any,
          config: uploadImage
            ? {
                uploader: {
                  async uploadByFile(file: File) {
                    const url = await uploadImage(file);
                    return { success: 1, file: { url } };
                  }
                }
              }
            : undefined
        }
      },
      async onChange(api) {
        const data = await api.saver.save();
        onChangeData?.(data as any);
      }
    });

    editorRef.current = editor;
    return () => {
      editor.destroy();
      editorRef.current = null;
    };
  }, []);

  return (
    <div className={className}>
      <div
        ref={holderRef}
        aria-label={ariaLabel}
        style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, minHeight: 280 }}
      />
    </div>
  );
}
