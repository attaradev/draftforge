# DraftForge React

Standalone React components for rich-text authoring and PDF export. Includes:

- **Editor** – block-based editor powered by Editor.js
- **Preview** – client-side HTML preview of Editor.js data
- **ExportButton** – kicks off an export and polls for completion
- **renderToHtml** – helper for server-side rendering

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

## Usage

The components are backend-agnostic. Provide URLs for your own export service:

```tsx
import { Editor, Preview, ExportButton } from 'draftforge';
import { useState } from 'react';

export default function Composer() {
  const [data, setData] = useState({ blocks: [] });

  return (
    <>
      <Editor initialData={data} onChangeData={setData} />
      <Preview data={data} />
      <ExportButton
        data={data}
        filename="document.pdf"
        exportUrl="/exports"
        pollBaseUrl="/exports"
      />
    </>
  );
}
```

Use with any backend capable of accepting Editor.js JSON and returning a PDF URL when ready.

