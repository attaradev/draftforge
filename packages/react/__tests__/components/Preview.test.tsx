import { render, screen } from '@testing-library/react';
import { Preview } from '../../src/components/Preview';

describe('Preview', () => {
  it('renders sanitized HTML', async () => {
    render(<Preview data={{ blocks: [{ type: 'paragraph', data: { text: 'Hi' } }] }} />);
    expect(await screen.findByText('Hi')).toBeTruthy();
  });

  it('paginates content', async () => {
    render(
      <Preview
        data={{
          blocks: [
            { type: 'paragraph', data: { text: 'First' } },
            { type: 'paragraph', data: { text: 'Second' } }
          ]
        }}
        page={2}
        pageSize={1}
      />
    );
    expect(await screen.findByText('Second')).toBeTruthy();
    expect(screen.queryByText('First')).toBeNull();
  });
});
