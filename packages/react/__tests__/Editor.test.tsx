import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Editor } from '../src/Editor';

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

  it('renders inline headers', () => {
    render(
      <Editor
        initialValue={[
          { type: 'paragraph', children: [{ text: 'Title', header: true }] } as any,
        ]}
      />
    );
    const el = screen.getByText('Title').closest('h2');
    expect(el).toBeTruthy();
    expect(el).toHaveStyle('display: inline');
  });
});

