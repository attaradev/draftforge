# frozen_string_literal: true

module DraftForge
  class ExportPdfJob < ActiveJob::Base
    queue_as :default

    def perform(export_id, raw_html)
      export = Export.find(export_id)
      export.update!(status: :processing)

      tempfile = PdfRenderer.call(raw_html)

      filename = export.requested_filename.presence || "document.pdf"
      export.pdf.attach(io: tempfile, filename: filename, content_type: 'application/pdf')
      tempfile.close!
      export.update!(status: :complete)
    rescue => e
      Rails.logger.error("[DraftForge] Export failed: #{e.class}: #{e.message}")
      export.update!(status: :failed) rescue nil
    end
  end
end
