# frozen_string_literal: true
require_relative "lib/draft_forge/version"


Gem::Specification.new do |spec|
  spec.name          = "draft_forge"
  spec.version       = DraftForge::VERSION
  spec.authors       = ["Mike Attara"]
  spec.email         = ["mpyebattara@gmail.com"]
  spec.summary       = "DraftForge — Rails engine for HTML->PDF exports"
  spec.description   = "A minimal Rails engine exposing endpoints to export sanitized HTML to PDF via Grover."
  spec.license       = "MIT"
  spec.homepage      = "https://github.com/draftforge/draftforge"
  spec.require_paths = ["lib"]
  spec.files         = Dir.chdir(__dir__) { Dir["{app,config,lib}/**/*", "MIT-LICENSE", "README.md", "CHANGELOG.md"] }

  spec.required_ruby_version = Gem::Requirement.new(">= 3.1")
  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = spec.homepage
  spec.metadata["changelog_uri"] = "#{spec.homepage}/blob/main/packages/rails/CHANGELOG.md"
  spec.metadata["rubygems_mfa_required"] = "true"

  spec.add_dependency "rails", ">= 7.1", "< 9.0"
  spec.add_dependency "grover", ">= 1.1"
  spec.add_dependency "sanitize", ">= 6.1"
end
