import { renderToHtml } from '../src/renderToHtml';

describe('renderToHtml', () => {
  it('renders basic blocks to HTML', () => {
    const html = renderToHtml({
      blocks: [
        { type: 'paragraph', data: { text: 'Hello <world>' } },
        { type: 'header', data: { text: 'Title', level: 3 } }
      ]
    });
    expect(html).toContain('<p>Hello &lt;world&gt;</p>');
    expect(html).toContain('<h3>Title</h3>');
  });

  it('marks editable state on blocks', () => {
    const html = renderToHtml({
      blocks: [
        { type: 'paragraph', data: { text: 'Locked' }, editable: false },
        { type: 'paragraph', data: { text: 'Open' }, editable: true }
      ]
    });
    expect(html).toContain('<p contenteditable="false">Locked</p>');
    expect(html).toContain('<p contenteditable="true">Open</p>');
  });

  it('paginates blocks', () => {
    const data = {
      blocks: [
        { type: 'paragraph', data: { text: 'First' } },
        { type: 'paragraph', data: { text: 'Second' } }
      ]
    };
    const html = renderToHtml(data, { page: 2, pageSize: 1 });
    expect(html).toContain('Second');
    expect(html).not.toContain('First');
  });
});
