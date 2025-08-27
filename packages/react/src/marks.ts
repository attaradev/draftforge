import { Editor } from 'slate';

/**
 * Toggle a formatting mark on the current selection.
 * Mirrors Slate's recommended helper from the documentation.
 */
export function toggleMark(editor: Editor, format: string) {
  const marks = Editor.marks(editor) as Record<string, unknown> | null;
  const isActive = marks ? marks[format] === true : false;
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}
