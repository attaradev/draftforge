# frozen_string_literal: true

require "draft_forge/version"
require "draft_forge/engine"
require "sanitize"

module DraftForge
  DEFAULT_SANITIZER_CONFIG = {
    elements: Sanitize::Config::RELAXED[:elements] + %w[table thead tbody tfoot tr td th figure figcaption],
    attributes: {
      'a' => ['href', 'title', 'target', 'rel'],
      'img' => ['src', 'alt', 'title', 'width', 'height'],
      'td' => ['colspan', 'rowspan', 'style'],
      'th' => ['colspan', 'rowspan', 'style'],
      :all => ['class', 'style', 'contenteditable']
    },
    protocols: {
      'a' => { 'href' => ['http', 'https', 'mailto', 'tel', :relative] },
      'img' => { 'src'  => ['http', 'https', :relative] }
    },
    transformers: []
  }.freeze

  mattr_accessor :sanitizer_config, default: DEFAULT_SANITIZER_CONFIG
  mattr_accessor :pdf_options, default: { format: 'A4', margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' } }

  def self.configure
    yield self
  end
end
