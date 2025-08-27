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

  it('applies custom editor class', () => {
    render(<Editor editorClassName="my-editor" />);
    expect(screen.getByLabelText('Rich text editor')).toHaveClass(
      'df-editor',
      'my-editor'
    );
  });

  it('renders provided header', () => {
    render(<Editor header={<h1>Header</h1>} />);
    expect(screen.getByText('Header')).toBeInTheDocument();
  });
});

