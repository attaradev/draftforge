# frozen_string_literal: true

module DraftForge
  class FetchExport
    def self.call(id)
      unless Export.table_exists?
        Rails.logger.error("[DraftForge] Missing `draft_forge_exports` table. Run `rails generate draft_forge:install` and `rails db:migrate`.")
        return
      end
      export = Export.find(id)
      result = { id: export.id, status: export.status }
      if export.complete? && export.pdf.attached?
        url = Rails.application.routes.url_helpers.rails_blob_url(export.pdf, only_path: false)
        result[:download_url] = url
      end
      result
    end
  end
end

