# DraftForge

A lightweight, stack-agnostic library for **web-native rich text authoring, live preview, and background PDF export**.

- `packages/react` — React components built on **Editor.js**: `Editor`, `Preview`, `ExportButton`, plus `renderToHtml` helper.
- `packages/rails` — Rails engine (`draft_forge`) exposing `/draftforge/exports` for async HTML→PDF via **Grover** (Puppeteer). Includes server-side HTML sanitization and Active Storage delivery.

## Quickstart

### 1) Rails API (engine)

#### **Gemfile**

```ruby
gem 'draft_forge', path: './packages/rails'
gem 'grover'
gem 'sanitize'
```

```bash
bundle install
bin/rails active_storage:install # if not present
bin/rails db:migrate
```

#### **config/routes.rb**

```ruby
mount DraftForge::Engine => '/draftforge'
```

You now have:

- `POST /draftforge/exports` → `{ id, status }`
- `GET  /draftforge/exports/:id` → `{ id, status }` or `{ id, status: "complete", download_url }`

Ensure headless Chrome/Chromium is available for Grover.

### 2) UI (React + Editor.js)

From `packages/react`:

```bash
pnpm i   # or npm i / yarn
pnpm build
```

In your app:

```tsx
import { Editor, Preview, ExportButton, renderToHtml } from 'draftforge';
import { useState } from 'react';

export default function Composer() {
  const [data, setData] = useState<any>({ blocks: [{ type: 'header', data: { text: 'Draft', level: 2 } }] });

  return (
    <div className="grid grid-cols-2 gap-6">
      <Editor
        initialData={data}
        onChangeData={setData}
        uploadImage={async (file) => {
          const form = new FormData();
          form.append('file', file);
          const res = await fetch('/uploads', { method: 'POST', body: form });
          const { url } = await res.json();
          return url;
        }}
      />
      <div>
        <Preview data={data} className="prose max-w-none" />
        <ExportButton
          data={data}
          filename="document.pdf"
          exportUrl="/draftforge/exports"
          pollBaseUrl="/draftforge/exports"
          onReady={(url) => window.open(url, '_blank')}
        />
      </div>
    </div>
  );
}
```

> Client converts Editor.js JSON → HTML for preview/export; server sanitizes and renders PDF in the background.

## Notes

- Harden for production: authN/Z, payload limits, stricter Sanitize config, CSP headers, long-running queue.
- You can extend the block renderer and styles to match product typography/layout.
