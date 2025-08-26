import type EditorJS from '@editorjs/editorjs';

export type UploadImageFn = (file: File) => Promise<string>;

export interface EditorJsData {
  time?: number;
  blocks: Array<any>;
  version?: string;
}

export interface EditorProps {
  initialData?: EditorJsData;
  onChangeData?: (data: EditorJsData) => void;
  uploadImage?: UploadImageFn;
  className?: string;
  /** Class applied to the Editor.js holder for custom styling */
  editorClassName?: string;
  /** Accessible label for the editor region */
  ariaLabel?: string;
  /** Placeholder text shown in the first empty block */
  placeholder?: string;
  /** Toggle read-only mode */
  readOnly?: boolean;
  /** Callback once the Editor.js instance is ready */
  onReady?: (editor: EditorJS) => void;
}

export interface PreviewProps {
  data: EditorJsData;
  className?: string;
}

export interface ExportOptions {
  data: EditorJsData;
  filename?: string;
  exportUrl: string;    // POST endpoint
  pollBaseUrl: string;  // GET base, i.e. `${pollBaseUrl}/${id}`
  onReady?: (downloadUrl: string) => void;
  fetchImpl?: typeof fetch;
  pollIntervalMs?: number;
  maxPolls?: number;
}
