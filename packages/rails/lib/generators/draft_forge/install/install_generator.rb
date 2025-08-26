# frozen_string_literal: true

require "rails/generators"
require "rails/generators/migration"

module DraftForge
  module Generators
    class InstallGenerator < Rails::Generators::Base
      include Rails::Generators::Migration

      source_root File.expand_path("templates", __dir__)

      def copy_initializer
        template "draft_forge.rb", "config/initializers/draft_forge.rb"
      end

      def copy_migration
        unless migration_exists?("db/migrate", "create_draft_forge_exports")
          migration_template "create_draft_forge_exports.rb", "db/migrate/create_draft_forge_exports.rb"
        end
      end

      def self.next_migration_number(dirname)
        Time.now.utc.strftime("%Y%m%d%H%M%S")
      end

      private

      def migration_exists?(dir, name)
        Dir.glob(File.join(destination_root, dir, "*_#{name}.rb")).any?
      end
    end
  end
end
