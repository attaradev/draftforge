import React, { useCallback } from 'react';
import { useSlate } from 'slate-react';
import { Editor as SlateEditor, Transforms, Element as SlateElement } from 'slate';
import { toggleMark } from './marks';

interface ToolbarProps {
  position: { top: number; left: number } | null;
  onRequestClose: () => void;
}

export const InlineToolbar: React.FC<ToolbarProps> = ({ position, onRequestClose }) => {
  const editor = useSlate();

  const handleToggleMark = useCallback((format: string) => {
    toggleMark(editor, format);
    onRequestClose();
  }, [editor, onRequestClose]);

  const insertImage = useCallback(() => {
    const url = window.prompt('Enter image URL');
    if (!url) return;
    const image = { type: 'image', url, width: 200, children: [{ text: '' }] } as any;
    Transforms.insertNodes(editor, image);
    onRequestClose();
  }, [editor, onRequestClose]);

  if (!position) return null;

  const imageEntry = SlateEditor.above(editor, {
    match: n => SlateElement.isElement(n) && (n as any).type === 'image',
  });

  const buttonStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: 'inherit',
    padding: '4px 6px',
    cursor: 'pointer',
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        transform: 'translate(-50%, -100%)',
        background: '#333',
        color: '#fff',
        padding: '4px',
        borderRadius: '4px',
        display: 'flex',
        gap: '4px',
        zIndex: 1000,
      }}
      data-testid="inline-toolbar"
    >
      {imageEntry ? (
        <input
          type="range"
          min={50}
          max={800}
          value={(imageEntry[0] as any).width || 200}
          onChange={e => {
            const w = parseInt(e.target.value, 10);
            Transforms.setNodes(editor, { width: w } as any, { at: imageEntry[1] });
          }}
          data-testid="resize-slider"
        />
      ) : (
        <>
          <button
            style={buttonStyle}
            onMouseDown={e => {
              e.preventDefault();
              handleToggleMark('bold');
            }}
          >
            <strong>B</strong>
          </button>
          <button
            style={buttonStyle}
            onMouseDown={e => {
              e.preventDefault();
              handleToggleMark('italic');
            }}
          >
            <em>I</em>
          </button>
          <button
            style={buttonStyle}
            onMouseDown={e => {
              e.preventDefault();
              insertImage();
            }}
            data-testid="add-image"
          >
            Img
          </button>
        </>
      )}
    </div>
  );
};

