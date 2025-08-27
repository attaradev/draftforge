import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Editor } from '../../src/components/Editor';

describe('Editor', () => {
  it('uses provided aria-label', () => {
    render(<Editor ariaLabel="Custom label" />);
    expect(screen.getByLabelText('Custom label')).toBeTruthy();
  });

  it('defaults aria-label when not provided', () => {
    render(<Editor />);
    expect(screen.getByLabelText('Rich text editor')).toBeTruthy();
  });

  it('applies custom class', () => {
    render(<Editor className="my-editor" />);
    expect(screen.getByLabelText('Rich text editor')).toHaveClass('my-editor');
  });

  it('respects editable flag on blocks', () => {
    render(
      <Editor
        initialValue={[
          { type: 'paragraph', editable: false, children: [{ text: 'Locked' }] } as any,
        ]}
      />
    );
    const el = screen.getByText('Locked').closest('[contenteditable]');
    expect(el).toHaveAttribute('contenteditable', 'false');
  });

  it('inserts image via toolbar', async () => {
    const promptSpy = jest.spyOn(window, 'prompt').mockReturnValue('http://img');
    render(<Editor initialValue={[{ type: 'paragraph', children: [{ text: 'hi' }] } as any]} />);
    const editable = screen.getByLabelText('Rich text editor');
    const textNode = editable.querySelector('span')!.firstChild as Text;
    const range = document.createRange();
    range.selectNodeContents(textNode);
    (range as any).getBoundingClientRect = () => ({
      top: 0,
      left: 0,
      width: 10,
      height: 10,
      bottom: 0,
      right: 0,
    });
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    fireEvent.mouseUp(editable);
    const addBtn = await screen.findByTestId('add-image');
    fireEvent.mouseDown(addBtn);
    expect(await screen.findByTestId('image')).toHaveAttribute('src', 'http://img');
    promptSpy.mockRestore();
  });

  it('resizes image via toolbar slider', async () => {
    render(
      <Editor
        initialValue={[
          { type: 'image', url: 'http://img', width: 100, children: [{ text: '' }] } as any,
        ]}
      />
    );
    const img = screen.getByTestId('image');
    fireEvent.click(img);
    const slider = screen.getByTestId('resize-slider');
    fireEvent.change(slider, { target: { value: '300' } });
    await waitFor(() => {
      expect(screen.getByTestId('image')).toHaveStyle({ width: '300px' });
    });
  });

  it('highlights search results', () => {
    render(
      <Editor
        initialValue={[{
          type: 'paragraph',
          children: [{ text: 'hello world' }],
        }] as any}
        searchQuery="world"
      />
    );
    const highlights = screen.getAllByTestId('search-highlight');
    expect(highlights).toHaveLength(1);
    expect(highlights[0]).toHaveTextContent('world');
  });
});

