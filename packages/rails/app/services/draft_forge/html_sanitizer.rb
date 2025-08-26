# frozen_string_literal: true
module DraftForge
  class HtmlSanitizer
    CONFIG = {
      elements: Sanitize::Config::RELAXED[:elements] + %w[table thead tbody tfoot tr td th figure figcaption],
      attributes: {
        'a' => ['href', 'title', 'target', 'rel'],
        'img' => ['src', 'alt', 'title', 'width', 'height'],
        'td' => ['colspan', 'rowspan', 'style'],
        'th' => ['colspan', 'rowspan', 'style'],
        :all => ['class', 'style']
      },
      protocols: {
        'a' => { 'href' => ['http', 'https', 'mailto', 'tel', :relative] },
        'img' => { 'src'  => ['http', 'https', :relative] }
      },
      transformers: []
    }

    def self.call(html)
      Sanitize.fragment(html.to_s, CONFIG.merge(remove_contents: ['script', 'style']))
    end
  end
end
