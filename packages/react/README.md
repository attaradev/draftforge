# DraftForge React

Standalone React components for rich-text authoring with delegated PDF export. Includes:

- **Editor** – rich-text editor powered by Slate with optional collaborative editing, configurable header, and support for non-editable blocks via an `editable` flag
- **Preview** – client-side HTML preview of Editor.js data
- **renderToHtml** – helper for server-side rendering
- **exportDocument** – delegates export to a backend service

## Installation

The components ship as a single npm package and rely on React and
React&nbsp;DOM&nbsp;18+ as peer dependencies. Install everything from npm (or
your preferred client):

```bash
npm install draftforge react react-dom

# with pnpm
pnpm add draftforge react react-dom
```

Import the bundled editor styles once in your application entry point so the
editor renders correctly:

```ts
import 'draftforge/dist/editor.css';
```

## Build

From this directory:

```bash
pnpm i
pnpm build
```

## Testing

Run the Jest suite to ensure changes behave as expected:

```bash
npm test
```

## Usage

The components are backend-agnostic. Provide URLs for your own export service:

```tsx
import { useState } from 'react';
import { Editor, Preview, exportDocument } from 'draftforge';
import 'draftforge/dist/editor.css';

export default function Composer() {
  const [value, setValue] = useState([
    { type: 'paragraph', children: [{ text: '' }] }
  ]); // blocks may include `editable: false` to lock sections

  const handleExport = async () => {
    const url = await exportDocument({
      data: { blocks: [] },
      filename: 'document.pdf',
      exportUrl: '/exports',
      pollBaseUrl: '/exports'
    });
    window.location.href = url;
  };

  return (
    <>
      <Editor
        initialValue={value}
        onChangeValue={setValue}
        header={<h1>My Document</h1>}
        collaborative
        collabUrl="ws://localhost:1234"
      />
      <Preview data={{ blocks: [] }} />
      <button onClick={handleExport}>Export PDF</button>
    </>
  );
}
```

Use with any backend capable of accepting Editor.js JSON and returning a URL
to a rendered PDF when ready.

### Long-running exports

`exportDocument` polls the backend until a download URL is ready. Large
documents can take longer to render, so the helper supports tuning the poll
behaviour with exponential backoff:

```ts
await exportDocument({
  data,
  exportUrl: '/exports',
  pollBaseUrl: '/exports',
  pollIntervalMs: 1000, // initial wait between polls
  backoffFactor: 1.5,   // multiply wait by 1.5 after each attempt
  maxPolls: 120         // stop after ~2 minutes
});
```

The backoff reduces network chatter when exporting very large PDFs (100+ pages).

### Pagination

`Preview` and `renderToHtml` accept optional `page` and `pageSize` parameters to
help work with very large Editor.js datasets. Render only a slice of blocks for
lightweight previews or server-side rendering:

```tsx
<Preview data={data} page={currentPage} pageSize={50} />

const html = renderToHtml(data, { page: 2, pageSize: 50 });
```

The `Editor` always loads the full dataset so you can scroll through pages just
like Google Docs.

### Efficient previews

`Preview` sanitizes the generated HTML on an idle callback so rendering huge
Editor.js datasets doesn't lock up the UI. The content appears once the browser
has time to process it, keeping previews responsive even for 100+ page drafts.
