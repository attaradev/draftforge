import { useCallback, useState } from 'react';
import {
  Slate,
  Editable,
  DefaultElement,
  type RenderElementProps,
  type RenderLeafProps,
  ReactEditor,
} from 'slate-react';
import { Editor as SlateEditor, Transforms, Text, Range, NodeEntry } from 'slate';
import { useEditor } from './useEditor';
import type { EditorProps } from './types';
import { InlineToolbar } from './InlineToolbar';

export function Editor({
  initialValue,
  onChangeValue,
  className,
  ariaLabel = 'Rich text editor',
  placeholder,
  searchQuery,
  readOnly,
  collaborative,
  collabUrl,
  renderElement: customRenderElement,
}: EditorProps) {
  const { editor, value, onChange } = useEditor({
    initialValue,
    onChangeValue,
    collaborative,
    collabUrl,
  });

  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number } | null>(
    null,
  );

  const baseRenderElement = useCallback(
    (props: RenderElementProps) => {
      const { element, attributes, children } = props as any;
      if (element.type === 'image') {
        const width = element.width || 200;
        return (
          <div {...attributes} contentEditable={false}>
            <img
              src={element.url}
              style={{ width }}
              data-testid="image"
              onClick={e => {
                const path = ReactEditor.findPath(editor, element);
                Transforms.select(editor, path);
                const rect = (e.target as HTMLElement).getBoundingClientRect();
                setToolbarPos({
                  top: rect.top + window.scrollY,
                  left: rect.left + rect.width / 2 + window.scrollX,
                });
              }}
            />
            {children}
          </div>
        );
      }
      if (element.editable === false) {
        const attrs = {
          ...attributes,
          contentEditable: false,
          suppressContentEditableWarning: true,
        } as any;
        return <DefaultElement {...props} attributes={attrs} />;
      }
      return <DefaultElement {...props} />;
    },
    [editor, setToolbarPos],
  );

  const renderElement = useCallback(
    (props: RenderElementProps) => {
      const custom = customRenderElement?.(props);
      if (custom) return custom;
      return baseRenderElement(props);
    },
    [baseRenderElement, customRenderElement],
  );

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    let { children } = props;
    if ((props.leaf as any).bold) {
      children = <strong>{children}</strong>;
    }
    if ((props.leaf as any).italic) {
      children = <em>{children}</em>;
    }
    const highlight = (props.leaf as any).highlight;
    return (
      <span
        {...props.attributes}
        style={highlight ? { backgroundColor: '#ffeeba' } : undefined}
        {...(highlight ? { 'data-testid': 'search-highlight' } : {})}
      >
        {children}
      </span>
    );
  }, []);

  const decorate = useCallback(
    ([node, path]: NodeEntry): Range[] => {
      const ranges: Range[] = [];
      if (!searchQuery || !Text.isText(node)) {
        return ranges;
      }
      const { text } = node;
      const query = searchQuery.toLowerCase();
      let start = 0;
      let index = text.toLowerCase().indexOf(query, start);
      while (index !== -1) {
        ranges.push({
          anchor: { path, offset: index },
          focus: { path, offset: index + query.length },
          highlight: true,
        } as any);
        start = index + query.length;
        index = text.toLowerCase().indexOf(query, start);
      }
      return ranges;
    },
    [searchQuery],
  );

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
        decorate={decorate}
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

