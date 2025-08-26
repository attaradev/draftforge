# frozen_string_literal: true
module DraftForge
  class ExportsController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :ensure_json

    def create
      html = params[:content_html].to_s
      filename = params[:filename].presence || "document.pdf"

      export = Export.create!(status: :queued, requested_filename: filename)
      ExportPdfJob.perform_later(export.id, html)

      render json: { id: export.id, status: export.status }
    rescue => e
      render json: { error: e.message }, status: 422
    end

    def show
      export = Export.find(params[:id])
      if export.complete? && export.pdf.attached?
        url = Rails.application.routes.url_helpers.rails_blob_url(export.pdf, only_path: false)
        render json: { id: export.id, status: export.status, download_url: url }
      else
        render json: { id: export.id, status: export.status }
      end
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Not found" }, status: 404
    end

    private

    def ensure_json
      request.format = :json
    end
  end
end
