# frozen_string_literal: true

require "bundler/setup"
require "draft_forge"
require "rspec"
require "sanitize"

RSpec.configure do |config|
  config.expect_with :rspec do |c|
    c.syntax = :expect
  end
end

