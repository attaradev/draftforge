# frozen_string_literal: true
require 'grover'

module DraftForge
  class ExportPdfJob < ActiveJob::Base
    queue_as :default

    def perform(export_id, raw_html)
      export = Export.find(export_id)
      export.update!(status: :processing)

      safe_html = HtmlSanitizer.call(raw_html)
      html = wrap_html(safe_html)

      pdf = Grover.new(html, DraftForge.pdf_options).to_pdf

      filename = export.requested_filename.presence || "document.pdf"
      export.pdf.attach(io: StringIO.new(pdf), filename: filename, content_type: 'application/pdf')
      export.update!(status: :complete)
    rescue => e
      Rails.logger.error("[DraftForge] Export failed: #{e.class}: #{e.message}")
      export.update!(status: :failed) rescue nil
    end

    private

    def wrap_html(body)
      options = DraftForge.pdf_options
      size = options[:format] || 'A4'
      margin = options[:margin] || {}
      top = margin[:top] || '20mm'
      right = margin[:right] || '15mm'
      bottom = margin[:bottom] || '20mm'
      left = margin[:left] || '15mm'

      <<~HTML
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <style>
              @page { size: #{size}; margin: #{top} #{right} #{bottom} #{left}; }
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif; font-size: 12px; line-height: 1.45; color: #111; }
              h1, h2, h3 { margin: 0 0 8px; }
              h1 { font-size: 22px; }
              h2 { font-size: 18px; }
              h3 { font-size: 15px; }
              p { margin: 0 0 8px; }
              table { width: 100%; border-collapse: collapse; margin: 8px 0; }
              th, td { border: 1px solid #ccc; padding: 6px 8px; vertical-align: top; }
              img { max-width: 100%; height: auto; }
              .page-break { page-break-after: always; }
              .checklist li { list-style: none; }
            </style>
          </head>
          <body>
            #{body}
          </body>
        </html>
      HTML
    end
  end
end
