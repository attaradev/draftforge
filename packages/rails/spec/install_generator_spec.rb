# frozen_string_literal: true

require "spec_helper"
require "fileutils"
require "generators/draft_forge/install/install_generator"

RSpec.describe DraftForge::Generators::InstallGenerator do
  it "creates initializer and migration" do
    destination = File.expand_path("tmp/destination", __dir__)
    FileUtils.rm_rf(destination)

    DraftForge::Generators::InstallGenerator.start([], destination_root: destination)

    initializer = File.join(destination, "config/initializers/draft_forge.rb")
    migration = Dir.glob(File.join(destination, "db/migrate/*_create_draft_forge_exports.rb")).first

    expect(File.exist?(initializer)).to be(true)
    expect(migration).not_to be_nil
    expect(File.read(migration)).to match(/create_table :draft_forge_exports/)
  end
end

