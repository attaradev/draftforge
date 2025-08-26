# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "draft_forge"
  spec.version       = DraftForge::VERSION
  spec.authors       = ["Mike Attara"]
  spec.email         = ["mpyebattara@gmail.com"]
  spec.summary       = "DraftForge — Rails engine for HTML->PDF exports"
  spec.description   = "A minimal Rails engine exposing endpoints to export sanitized HTML to PDF via Grover."
  spec.license       = "MIT"
  spec.require_paths = ["lib"]
  spec.files         = Dir.chdir(__dir__) { Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "README.md"] }

  spec.add_dependency "rails", ">= 7.1", "< 9.0"
  spec.add_dependency "grover", ">= 1.1"
  spec.add_dependency "sanitize", ">= 6.1"
end
