# frozen_string_literal: true
module DraftForge
  class HtmlSanitizer
    def self.call(html)
      config = DraftForge.sanitizer_config
      Sanitize.fragment(html.to_s, config.merge(remove_contents: ['script', 'style']))
    end
  end
end
