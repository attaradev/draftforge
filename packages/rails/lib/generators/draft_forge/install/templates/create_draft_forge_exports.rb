# frozen_string_literal: true

class CreateDraftForgeExports < ActiveRecord::Migration[7.1]
  def change
    create_table :draft_forge_exports, id: :uuid do |t|
      t.integer :status, null: false, default: 0
      t.string  :requested_filename
      t.timestamps
    end
  end
end
