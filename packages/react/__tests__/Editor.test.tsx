import { render, screen } from '@testing-library/react';
import { Editor } from '../src/Editor';

jest.mock('@editorjs/editorjs', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({ destroy: jest.fn() })),
  LogLevels: { ERROR: 'ERROR' }
}));

jest.mock('@editorjs/header', () => ({ __esModule: true, default: function () {} }));
jest.mock('@editorjs/list', () => ({ __esModule: true, default: function () {} }));
jest.mock('@editorjs/checklist', () => ({ __esModule: true, default: function () {} }));
jest.mock('@editorjs/table', () => ({ __esModule: true, default: function () {} }));
jest.mock('@editorjs/quote', () => ({ __esModule: true, default: function () {} }));
jest.mock('@editorjs/code', () => ({ __esModule: true, default: function () {} }));
jest.mock('@editorjs/image', () => ({ __esModule: true, default: function () {} }));

describe('Editor', () => {
  it('uses provided aria-label', () => {
    render(<Editor ariaLabel="Custom label" />);
    expect(screen.getByLabelText('Custom label')).toBeTruthy();
  });

  it('defaults aria-label when not provided', () => {
    render(<Editor />);
    expect(screen.getByLabelText('Rich text editor')).toBeTruthy();
  });

  it('passes placeholder to Editor.js', () => {
    const EditorJS = require('@editorjs/editorjs').default as jest.Mock;
    render(<Editor placeholder="Type here" />);
    expect(EditorJS).toHaveBeenCalledWith(
      expect.objectContaining({ placeholder: 'Type here' })
    );
  });
});

