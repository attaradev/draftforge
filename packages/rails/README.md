# draft_forge

Rails engine for exporting HTML to PDF. Can be paired with any front-end or used standalone.

## Installation

Copy an initializer and migration into your application:

```bash
bin/rails generate draft_forge:install
```

Attempting to use DraftForge's services before running the generator and
migrating will log an error directing you to install and migrate.

## Mounting

Expose DraftForge's endpoints by mounting the engine in your application's
routes:

```ruby
# config/routes.rb
Rails.application.routes.draw do
  mount DraftForge::Engine => "/draft_forge"
end
```

This provides `POST /draft_forge` to queue a PDF export and
`GET /draft_forge/:id` to check status or download the finished file.

## Services

If you prefer not to expose HTTP endpoints, you can queue and fetch exports
directly with service objects:

```ruby
export = DraftForge::CreateExport.call(
  content_html: "<p>Hello world</p>",
  filename: "hello.pdf"
)

DraftForge::FetchExport.call(export.id)
# => { id: 1, status: "queued" }
```

## Configuration

`DraftForge` exposes simple configuration hooks for PDF rendering and HTML
sanitization. The sanitizer controls which HTML elements (blocks) are allowed,
letting you distinguish between editable and non-editable content. By default
the sanitizer permits the `contenteditable` attribute so sanitized markup can
be used in live editors.

```ruby
# config/initializers/draft_forge.rb
DraftForge.configure do |config|
  # Change page size/margins for Grover
  config.pdf_options = { format: 'Letter' }

  # Permit additional HTML elements
  config.sanitizer_config[:elements] += %w[hr]
end
```
