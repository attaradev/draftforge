# frozen_string_literal: true

require "spec_helper"

RSpec.describe DraftForge::Engine do
  it "inherits from Rails::Engine" do
    expect(DraftForge::Engine.instance).to be_a(Rails::Engine)
  end

  it "is isolated" do
    expect(DraftForge::Engine.isolated?).to be(true)
  end
end

