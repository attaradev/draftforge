# DraftForge

A lightweight, stack-agnostic library for **web-native rich text authoring, live preview, and delegated PDF export**.

This repository hosts two independent packages:

- `packages/react` — React components built on **Editor.js**: `Editor`, `Preview`, plus helpers for HTML rendering and export delegation.
- `packages/rails` — Rails engine (`draft_forge`) exposing `/draftforge/exports` for async HTML→PDF via **Grover** (Puppeteer). Includes server-side HTML sanitization and Active Storage delivery.

Each package can be used on its own or combined. Refer to their READMEs for setup and configuration:

- [React components](packages/react/README.md)
- [Rails engine](packages/rails/README.md)

## Notes

- Harden for production: authN/Z, payload limits, stricter Sanitize config, CSP headers, long-running queue.
- You can extend the block renderer and styles to match product typography/layout.
