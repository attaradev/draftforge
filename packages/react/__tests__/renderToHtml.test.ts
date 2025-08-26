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
});
