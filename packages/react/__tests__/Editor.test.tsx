import { render, screen } from '@testing-library/react';
import { Editor } from '../src/Editor';

jest.mock('@editorjs/editorjs', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({ destroy: jest.fn() })),
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
});

