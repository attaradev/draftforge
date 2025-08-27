# DraftForge Overview

DraftForge supplies end‑to‑end building blocks for web‑native rich‑text workflows.
It combines a modern client authoring experience with a server‑side pipeline for
rendering trusted HTML and exporting PDFs.

## Packages

The repository hosts two packages that can be used together or separately:

### React Components (`packages/react`)

Reusable components and helpers for building authoring interfaces.

- **Editor** – headless editor powered by Slate with an inline formatting toolbar.
- **CompositeEditor** – manage multiple sections with independent editability.
- **Preview** – client‑side HTML preview for block data.
- **renderToHtml** – helper for server‑side rendering.
- **exportDocument** – delegates PDF generation to a backend service.

```bash
npm install draftforge react react-dom
```
See [React package README](../packages/react/README.md) for a full usage
example and API details.

### Rails Engine (`packages/rails`)

A Rails engine that exposes endpoints and service objects for creating and
fetching PDF exports. It sanitizes incoming HTML, stores rendered files with
Active Storage, and uses [Grover](https://github.com/Studiosity/grover) for
headless Chrome rendering.

See [Rails package README](../packages/rails/README.md) for setup details.

## Quick Start

1. **Choose your frontend** – use the React components or roll your own client
   that produces block JSON.
2. **Expose an export service** – mount the Rails engine or implement a custom
   HTTP endpoint that accepts the exported JSON and responds with a polling URL.
3. **Delegate export** – call `exportDocument` from the client or trigger
   `DraftForge::CreateExport` on the server to generate a PDF asynchronously.

## Development

Each package lives in isolation. Install dependencies and run tests in the
package you are modifying:

```bash
# React components
cd packages/react
npm test

# Rails engine
cd packages/rails
bundle exec rspec
```

## License

DraftForge is released under the MIT License. See the [LICENSE](../packages/rails/MIT-LICENSE)
file for the full text.
