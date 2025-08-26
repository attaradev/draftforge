# DraftForge

DraftForge provides building blocks for **web‑native rich‑text authoring, live preview, and delegated PDF export**.
It packages a set of client‑side components and a Rails engine that work together
or independently to render trusted HTML and deliver PDF exports.

## Packages

This repository hosts two packages:

- `packages/react` – React components built on **Editor.js**: `Editor`,
  `Preview`, `renderToHtml`, and `exportDocument` for delegating PDF export.
- `packages/rails` – Rails engine (`draft_forge`) exposing `/draft_forge` endpoints
  for async HTML or Editor.js JSON → PDF via **Grover** (Puppeteer). Includes
  server‑side HTML sanitization and Active Storage delivery.

For deeper package documentation, see the [React README](packages/react/README.md)
and the [Rails README](packages/rails/README.md). A high‑level overview lives in
[`docs/overview.md`](docs/overview.md).

## Quick Start

1. Install the package(s) you need and follow their README instructions.
2. Use the React `Editor` to collect Editor.js JSON data or provide your own payload.
3. Delegate PDF generation to a backend service – the Rails engine supplies a ready‑made implementation.

## Development

This repository is a small monorepo. Each package lives in isolation and has its
own build and test tooling. To work on the code locally, install the
dependencies for the package you're touching and run its test suite:

- **React package**

  ```bash
  cd packages/react
  npm test
  ```

- **Rails engine**

  ```bash
  cd packages/rails
  bundle exec rspec
  ```

## License

DraftForge is released under the [MIT License](packages/rails/MIT-LICENSE).

## Notes

- Harden for production: authN/Z, payload limits, stricter Sanitize config,
  CSP headers, long‑running queue.
- You can extend the block renderer and styles to match product typography/layout.
