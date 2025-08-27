# DraftForge React

Standalone React helpers for rich-text authoring with delegated PDF export. Includes:

- **Editor** – headless rich-text editor powered by Slate with optional collaborative editing, an inline formatting toolbar, and
  support for non-editable blocks via an `editable` flag
- **CompositeEditor** – combines multiple editable sections into one editor instance
- **Preview** – client-side HTML preview of block data
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
        collaborative
        collabUrl="ws://localhost:1234"
      />
      <Preview data={{ blocks: [] }} />
      <button onClick={handleExport}>Export PDF</button>
    </>
  );
}
```

Use with any backend capable of accepting block JSON and returning a URL
to a rendered PDF when ready.

### Editor

```tsx
import { Editor } from 'draftforge';

<Editor initialValue={[{ type: 'paragraph', children: [{ text: 'Hi' }] }]} />
```

### CompositeEditor

```tsx
import { CompositeEditor } from 'draftforge';

<CompositeEditor
  sections={[
    { id: '1', value: [{ type: 'paragraph', children: [{ text: 'first' }] }] },
    { id: '2', value: [{ type: 'paragraph', children: [{ text: 'second' }] }], editable: false }
  ]}
/>
```

### useEditor

```tsx
import { Editor, useEditor } from 'draftforge';

function Controlled() {
  const { editor, value, setValue } = useEditor([]);
  return <Editor editor={editor} value={value} onChangeValue={setValue} />;
}
```

### Preview

```tsx
import { Preview } from 'draftforge';

<Preview data={{ blocks: [{ type: 'paragraph', data: { text: 'Hi' } }] }} />
```

### renderToHtml

```ts
import { renderToHtml } from 'draftforge';

const html = renderToHtml({
  blocks: [{ type: 'paragraph', data: { text: 'Hello' } }]
});
```

### exportDocument

```ts
import { exportDocument } from 'draftforge';

await exportDocument({
  data: { blocks: [] },
  exportUrl: '/exports',
  pollBaseUrl: '/exports'
});
```

#### Long-running exports

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
help work with very large datasets. Render only a slice of blocks for
lightweight previews or server-side rendering:

```tsx
<Preview data={data} page={currentPage} pageSize={50} />

const html = renderToHtml(data, { page: 2, pageSize: 50 });
```

The `Editor` always loads the full dataset so you can scroll through pages just
like Google Docs.

### Efficient previews

`Preview` sanitizes the generated HTML on an idle callback so rendering huge
datasets doesn't lock up the UI. The content appears once the browser
has time to process it, keeping previews responsive even for 100+ page drafts.
