# frozen_string_literal: true

module DraftForge
  class FetchExport
    def self.call(id)
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

