import { useState, useCallback, useMemo } from 'react';
import type { CompositeEditorProps, Section } from '../types';
import type { Descendant } from 'slate';
import { Editor } from './Editor';

export function CompositeEditor({ sections, onChangeSections, className }: CompositeEditorProps) {
  const [data, setData] = useState<Section[]>(sections);

  const combinedValue = useMemo(
    () =>
      data.map(sec => ({
        type: 'section',
        sectionId: sec.id,
        editable: sec.editable,
        children: sec.value,
      })),
    [data],
  );

  const handleChange = useCallback(
    (value: Descendant[]) => {
      const next = (value as any[]).map(node => ({
        id: node.sectionId as string,
        editable: node.editable as boolean | undefined,
        value: node.children as Descendant[],
      }));
      setData(next);
      onChangeSections?.(next);
    },
    [onChangeSections],
  );

  const deleteSection = useCallback(
    (id: string) => {
      setData(prev => {
        const next = prev.filter(sec => sec.id !== id);
        onChangeSections?.(next);
        return next;
      });
    },
    [onChangeSections],
  );

  const renderSection = useCallback(
    (props: any) => {
      const { element, attributes, children } = props;
      if (element.type !== 'section') return undefined;
      const attrs: any = { ...attributes };
      if (element.editable === false) {
        attrs.contentEditable = false;
        attrs.suppressContentEditableWarning = true;
      }
      return (
        <div {...attrs} data-section-id={element.sectionId}>
          {children}
          {element.editable !== false && (
            <button onClick={() => deleteSection(element.sectionId)}>Delete</button>
          )}
        </div>
      );
    },
    [deleteSection],
  );

  return (
    <Editor
      key={data.map(s => s.id).join(',')}
      initialValue={combinedValue as any}
      onChangeValue={handleChange}
      className={className}
      renderElement={renderSection}
    />
  );
}

