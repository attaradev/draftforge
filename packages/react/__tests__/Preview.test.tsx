import { render, screen } from '@testing-library/react';
import { Preview } from '../src/Preview';

describe('Preview', () => {
  it('renders sanitized HTML', () => {
    render(<Preview data={{ blocks: [{ type: 'paragraph', data: { text: 'Hi' } }] }} />);
    expect(screen.getByText('Hi')).toBeTruthy();
  });
});
