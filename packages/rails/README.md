# draft_forge

Rails engine for exporting HTML to PDF. Can be paired with any front-end or used standalone.

## Configuration

`DraftForge` exposes simple configuration hooks for PDF rendering and HTML
sanitization. The sanitizer controls which HTML elements (blocks) are allowed,
letting you distinguish between editable and non-editable content.

```ruby
# config/initializers/draft_forge.rb
DraftForge.configure do |config|
  # Change page size/margins for Grover
  config.pdf_options = { format: 'Letter' }

  # Permit additional HTML elements
  config.sanitizer_config[:elements] += %w[hr]
end
```
