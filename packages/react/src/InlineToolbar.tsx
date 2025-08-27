import React from 'react';
import { useSlate } from 'slate-react';
import { Editor as SlateEditor } from 'slate';

interface ToolbarProps {
  position: { top: number; left: number } | null;
  onRequestClose: () => void;
}

export const InlineToolbar: React.FC<ToolbarProps> = ({ position, onRequestClose }) => {
  const editor = useSlate();
  if (!position) return null;

  const toggleMark = (format: string) => {
    const marks = SlateEditor.marks(editor);
    const isActive = marks ? (marks as any)[format] === true : false;
    if (isActive) {
      SlateEditor.removeMark(editor, format);
    } else {
      SlateEditor.addMark(editor, format, true);
    }
    onRequestClose();
  };

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
      <button
        style={buttonStyle}
        onMouseDown={e => {
          e.preventDefault();
          toggleMark('bold');
        }}
      >
        <strong>B</strong>
      </button>
      <button
        style={buttonStyle}
        onMouseDown={e => {
          e.preventDefault();
          toggleMark('italic');
        }}
      >
        <em>I</em>
      </button>
      <button
        style={buttonStyle}
        onMouseDown={e => {
          e.preventDefault();
          toggleMark('header');
        }}
      >
        H2
      </button>
    </div>
  );
};

