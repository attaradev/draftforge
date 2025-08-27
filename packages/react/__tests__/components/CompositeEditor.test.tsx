import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CompositeEditor } from '../../src/components/CompositeEditor';

describe('CompositeEditor', () => {
  it('renders sections in order and respects editability', () => {
    render(
      <CompositeEditor
        sections={[
          {
            id: '1',
            value: [{ type: 'paragraph', children: [{ text: 'first' }] } as any],
          },
          {
            id: '2',
            value: [{ type: 'paragraph', children: [{ text: 'second' }] } as any],
            editable: false,
          },
        ]}
      />,
    );
    const texts = screen.getAllByText(/first|second/);
    expect(texts[0]).toHaveTextContent('first');
    expect(texts[1]).toHaveTextContent('second');
    const firstSection = screen.getByText('first').closest('[data-section-id="1"]');
    const secondSection = screen.getByText('second').closest('[data-section-id="2"]');
    expect(firstSection).not.toHaveAttribute('contenteditable', 'false');
    expect(secondSection).toHaveAttribute('contenteditable', 'false');
  });

  it('allows deleting editable sections', () => {
    render(
      <CompositeEditor
        sections={[
          {
            id: '1',
            value: [{ type: 'paragraph', children: [{ text: 'delete me' }] } as any],
          },
        ]}
      />,
    );
    fireEvent.click(screen.getByText('Delete'));
    expect(screen.queryByText('delete me')).toBeNull();
  });
});
