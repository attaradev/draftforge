# frozen_string_literal: true

module DraftForge
  class CreateExport
    def self.call(content_html:, filename: nil)
      html = content_html.to_s
      name = filename.presence || 'document.pdf'

      export = Export.create!(status: :queued, requested_filename: name)
      ExportPdfJob.perform_later(export.id, html)

      export
    end
  end
end

