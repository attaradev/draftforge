import './editor.css';
import {
  useMemo,
  useState,
  useEffect,
} from 'react';
import { createEditor, Descendant } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { withYjs, YjsEditor } from '@slate-yjs/core';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import type { EditorProps } from './types';

const EMPTY_VALUE: Descendant[] = [
  { type: 'paragraph', children: [{ text: '' }] } as any
];

export function Editor({
  initialValue,
  onChangeValue,
  header,
  className,
  editorClassName,
  ariaLabel = 'Rich text editor',
  placeholder,
  readOnly,
  collaborative,
  collabUrl,
}: EditorProps) {
  const [value, setValue] = useState<Descendant[]>(
    initialValue ?? EMPTY_VALUE
  );

  const ydoc = useMemo(() => (collaborative ? new Y.Doc() : null), [collaborative]);
  const provider = useMemo(() => {
    if (!collaborative || !ydoc) return null;
    return new WebsocketProvider(collabUrl || 'ws://localhost:1234', 'draft', ydoc);
  }, [collaborative, collabUrl, ydoc]);
  const sharedType = useMemo(() => ydoc?.getXmlFragment('content'), [ydoc]);

  const editor = useMemo(() => {
    let e: any = withReact(withHistory(createEditor()));
    if (collaborative && sharedType) {
      e = withYjs(e, sharedType as any) as any;
    }
    return e;
  }, [collaborative, sharedType]);

  useEffect(() => {
    if (collaborative && editor) {
      YjsEditor.connect(editor as any);
      return () => {
        YjsEditor.disconnect(editor as any);
        provider?.destroy();
      };
    }
  }, [collaborative, editor, provider]);

  return (
    <div className={className}>
      {header && <div className="df-editor-header">{header}</div>}
      <Slate
        editor={editor}
        initialValue={value}
        onChange={(v) => {
          setValue(v);
          onChangeValue?.(v);
        }}
      >
        <Editable
          className={['df-editor', editorClassName].filter(Boolean).join(' ')}
          aria-label={ariaLabel}
          placeholder={placeholder}
          readOnly={readOnly}
        />
      </Slate>
    </div>
  );
}

