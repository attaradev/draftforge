# DraftForge React

Standalone React components for rich-text authoring with delegated PDF export. Includes:

- **Editor** – block-based editor powered by Editor.js
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
  const [data, setData] = useState({ blocks: [] });

  const handleExport = async () => {
    const url = await exportDocument({
      data,
      filename: 'document.pdf',
      exportUrl: '/exports',
      pollBaseUrl: '/exports'
    });
    window.location.href = url;
  };

  return (
    <>
      <Editor initialData={data} onChangeData={setData} />
      <Preview data={data} />
      <button onClick={handleExport}>Export PDF</button>
    </>
  );
}
```

Use with any backend capable of accepting Editor.js JSON and returning a URL
to a rendered PDF when ready.
