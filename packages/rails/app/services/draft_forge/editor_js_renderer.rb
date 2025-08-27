# frozen_string_literal: true

require 'json'

module DraftForge
  # Convert Editor.js data to basic HTML
class EditorJsRenderer
    def self.call(data)
      data = parse(data)
      blocks = data.fetch('blocks', [])
      blocks.map { |block| render_block(block) }.join
    end

    def self.parse(data)
      if data.is_a?(String)
        JSON.parse(data)
      elsif data.respond_to?(:to_unsafe_h)
        data.to_unsafe_h
      else
        data || {}
      end
    end

    def self.render_block(block)
      type = block['type']
      bdata = block['data'] || {}
      case type
      when 'paragraph'
        "<p>#{bdata['text']}</p>"
      when 'header'
        level = bdata['level'].to_i
        level = 1 if level < 1
        level = 6 if level > 6
        "<h#{level}>#{bdata['text']}</h#{level}>"
      when 'inline-header'
        level = bdata['level'].to_i
        level = 1 if level < 1
        level = 6 if level > 6
        "<h#{level} style='display:inline'>#{bdata['text']}</h#{level}>"
      when 'list'
        tag = bdata['style'] == 'ordered' ? 'ol' : 'ul'
        items = Array(bdata['items']).map { |item| "<li>#{item}</li>" }.join
        "<#{tag}>#{items}</#{tag}>"
      else
        ''
      end
    end
  end
end
