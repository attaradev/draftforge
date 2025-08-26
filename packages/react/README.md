# DraftForge React

Standalone React components for rich-text authoring with delegated PDF export. Includes:

- **Editor** – block-based editor powered by Editor.js
- **Preview** – client-side HTML preview of Editor.js data
- **renderToHtml** – helper for server-side rendering
- **exportDocument** – delegates export to a backend service

## Installation

```bash
npm install draftforge
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
import { Editor, Preview, exportDocument } from 'draftforge';
import { useState } from 'react';

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

Use with any backend capable of accepting Editor.js JSON and returning a PDF URL when ready.
