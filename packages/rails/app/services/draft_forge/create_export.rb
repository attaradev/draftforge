# frozen_string_literal: true

module DraftForge
  class CreateExport
    def self.call(content_html: nil, content_json: nil, filename: nil)
      unless Export.table_exists?
        Rails.logger.error("[DraftForge] Missing `draft_forge_exports` table. Run `rails generate draft_forge:install` and `rails db:migrate`.")
        return
      end
      html = if content_json
               EditorJsRenderer.call(content_json)
             else
               content_html.to_s
             end
      name = filename.presence || 'document.pdf'

      export = Export.create!(status: :queued, requested_filename: name)
      ExportPdfJob.perform_later(export.id, html)

      export
    end
  end
end

