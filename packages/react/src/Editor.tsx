import { useCallback, useState } from 'react';
import {
  Slate,
  Editable,
  DefaultElement,
  type RenderElementProps,
  type RenderLeafProps,
} from 'slate-react';
import { Editor as SlateEditor } from 'slate';
import { useEditor } from './useEditor';
import type { EditorProps } from './types';
import { InlineToolbar } from './InlineToolbar';

export function Editor({
  initialValue,
  onChangeValue,
  className,
  ariaLabel = 'Rich text editor',
  placeholder,
  readOnly,
  collaborative,
  collabUrl,
}: EditorProps) {
  const { editor, value, onChange } = useEditor({
    initialValue,
    onChangeValue,
    collaborative,
    collabUrl,
  });

  const renderElement = useCallback((props: RenderElementProps) => {
    if ((props.element as any).editable === false) {
      const attributes = {
        ...props.attributes,
        contentEditable: false,
        suppressContentEditableWarning: true,
      } as any;
      return <DefaultElement {...props} attributes={attributes} />;
    }
    return <DefaultElement {...props} />;
  }, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    let { children } = props;
    if ((props.leaf as any).bold) {
      children = <strong>{children}</strong>;
    }
    if ((props.leaf as any).italic) {
      children = <em>{children}</em>;
    }
    if ((props.leaf as any).inlineHeader) {
      children = (
        <h2 style={{ display: 'inline' }}>
          {children}
        </h2>
      );
    }
    return <span {...props.attributes}>{children}</span>;
  }, []);

  const toggleMark = useCallback((format: string) => {
    const marks = SlateEditor.marks(editor);
    const isActive = marks ? (marks as any)[format] === true : false;
    if (isActive) {
      SlateEditor.removeMark(editor, format);
    } else {
      SlateEditor.addMark(editor, format, true);
    }
  }, [editor]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!event.ctrlKey && !event.metaKey) return;
    if (event.key === 'b') {
      event.preventDefault();
      toggleMark('bold');
    }
    if (event.key === 'i') {
      event.preventDefault();
      toggleMark('italic');
    }
  }, [toggleMark]);

  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number } | null>(
    null
  );

  const updateToolbar = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setToolbarPos({
        top: rect.top + window.scrollY,
        left: rect.left + rect.width / 2 + window.scrollX,
      });
    } else {
      setToolbarPos(null);
    }
  }, []);

  return (
    <Slate editor={editor} initialValue={value} onChange={onChange}>
      <Editable
        className={className}
        aria-label={ariaLabel}
        placeholder={placeholder}
        readOnly={readOnly}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={handleKeyDown}
        onMouseUp={updateToolbar}
        onKeyUp={updateToolbar}
        onBlur={() => setToolbarPos(null)}
      />
      <InlineToolbar
        position={toolbarPos}
        onRequestClose={() => setToolbarPos(null)}
      />
    </Slate>
  );
}

