import type { Descendant } from 'slate';

export interface EditorJsBlock {
  /** Block type identifier, e.g. `paragraph` */
  type: string;
  /** Arbitrary data specific to the block type */
  data: any;
  /** Whether this block is editable in the rendered HTML */
  editable?: boolean;
  [key: string]: any;
}

export interface EditorJsData {
  time?: number;
  blocks: EditorJsBlock[];
  version?: string;
}

export interface EditorProps {
  initialValue?: Descendant[];
  onChangeValue?: (value: Descendant[]) => void;
  /** Class applied to the editable element for custom styling */
  className?: string;
  /** Accessible label for the editor region */
  ariaLabel?: string;
  /** Placeholder text shown when empty */
  placeholder?: string;
  /** Toggle read-only mode */
  readOnly?: boolean;
  /** Enable collaborative editing via Yjs */
  collaborative?: boolean;
  /** Websocket endpoint for collaborative editing */
  collabUrl?: string;
}

export type UseEditorOptions = Pick<EditorProps, 'initialValue' | 'onChangeValue' | 'collaborative' | 'collabUrl'>;

export interface PreviewProps {
  data: EditorJsData;
  className?: string;
  /** Page number to render when working with large datasets */
  page?: number;
  /** Maximum blocks per page; omit to render all blocks */
  pageSize?: number;
}

export interface RenderOptions {
  page?: number;
  pageSize?: number;
}

export interface ExportOptions {
  data: EditorJsData;
  filename?: string;
  exportUrl: string;    // POST endpoint
  pollBaseUrl: string;  // GET base, i.e. `${pollBaseUrl}/${id}`
  onReady?: (downloadUrl: string) => void;
  fetchImpl?: typeof fetch;
  pollIntervalMs?: number;
  /** Multiplier applied to the poll interval after each attempt */
  backoffFactor?: number;
  maxPolls?: number;
}
