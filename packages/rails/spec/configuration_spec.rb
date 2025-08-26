# frozen_string_literal: true

require "spec_helper"

RSpec.describe "Configuration" do
  before do
    DraftForge.sanitizer_config = Marshal.load(Marshal.dump(DraftForge::DEFAULT_SANITIZER_CONFIG))
    DraftForge.pdf_options = { format: 'A4', margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' } }
  end

  it "uses default sanitizer config" do
    expect(DraftForge.sanitizer_config[:elements]).to include('table')
    expect(DraftForge.sanitizer_config[:attributes][:all]).to include('contenteditable')
  end

  it "allows configuration overrides" do
    DraftForge.configure do |config|
      config.pdf_options = { format: 'Letter' }
      config.sanitizer_config[:elements] += ['hr']
    end

    expect(DraftForge.pdf_options).to eq({ format: 'Letter' })
    expect(DraftForge.sanitizer_config[:elements]).to include('hr')
  end

  it "sanitizes custom elements and attributes" do
    html = '<table class="t"><tr><td contenteditable="true">X</td></tr></table>'
    sanitized = Sanitize.fragment(html, DraftForge.sanitizer_config)

    expect(sanitized).to include('<table')
    expect(sanitized).to include('class="t"')
    expect(sanitized).to include('contenteditable="true"')
  end
end

