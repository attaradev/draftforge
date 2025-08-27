require 'spec_helper'
require_relative '../app/services/draft_forge/editor_js_renderer'

RSpec.describe DraftForge::EditorJsRenderer do
  it 'renders basic blocks to html' do
    data = {
      'blocks' => [
        { 'type' => 'header', 'data' => { 'text' => 'Title', 'level' => 2 } },
        { 'type' => 'paragraph', 'data' => { 'text' => 'Hello' } },
        { 'type' => 'list', 'data' => { 'style' => 'unordered', 'items' => ['a', 'b'] } }
      ]
    }
    html = described_class.call(data)
    expect(html).to include('<h2>Title</h2>')
    expect(html).to include('<p>Hello</p>')
    expect(html).to include('<ul><li>a</li><li>b</li></ul>')
  end

end
