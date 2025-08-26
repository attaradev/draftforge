# frozen_string_literal: true

require 'spec_helper'
require_relative '../app/services/draft_forge/html_sanitizer'
require_relative '../app/services/draft_forge/pdf_renderer'

RSpec.describe DraftForge::PdfRenderer do
  it 'returns a tempfile containing a PDF' do
    fake = instance_double('Grover')
    allow(Grover).to receive(:new).and_return(fake)
    allow(fake).to receive(:to_pdf) do |path:|
      File.open(path, 'wb') { |f| f.write('%PDF-1.4') }
    end

    file = described_class.call('<p>Hello</p>')
    expect(File.exist?(file.path)).to be(true)
    header = File.read(file.path, 4)
    expect(header).to eq('%PDF')
    file.close!
  end
end
