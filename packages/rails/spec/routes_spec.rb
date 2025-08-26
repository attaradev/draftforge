# frozen_string_literal: true

require "spec_helper"

RSpec.describe "Routes" do
  before do
    load DraftForge::Engine.root.join("config/routes.rb")
  end

  it "exposes export endpoints" do
    routes = DraftForge::Engine.routes.routes.map do |r|
      [r.verb, r.path.spec.to_s, r.defaults[:controller], r.defaults[:action]]
    end

    expect(routes).to include(["POST", "/", "draft_forge/exports", "create"])
    expect(routes).to include(["GET", "/:id(.:format)", "draft_forge/exports", "show"])
  end
end

