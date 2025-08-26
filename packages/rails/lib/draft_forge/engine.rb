# frozen_string_literal: true

require "rails"
require "sanitize"

module DraftForge
  class Engine < ::Rails::Engine
    isolate_namespace DraftForge
  end
end
