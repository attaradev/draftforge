# frozen_string_literal: true
module DraftForge
  class Export < ApplicationRecord
    self.table_name = "draft_forge_exports"

    enum status: { queued: 0, processing: 1, complete: 2, failed: 3 }
    has_one_attached :pdf
  end
end
