import type { Descendant } from 'slate';
import type { RenderElementProps } from 'slate-react';

export interface Block {
  /** Block type identifier, e.g. `paragraph` */
  type: string;
  /** Arbitrary data specific to the block type */
  data: any;
  /** Whether this block is editable in the rendered HTML */
  editable?: boolean;
  [key: string]: any;
}

export interface Document {
  time?: number;
  blocks: Block[];
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
  /** Highlights matching text when provided */
  searchQuery?: string;
  /** Toggle read-only mode */
  readOnly?: boolean;
  /** Enable collaborative editing via Yjs */
  collaborative?: boolean;
  /** Websocket endpoint for collaborative editing */
  collabUrl?: string;
  /** Custom element renderer */
  renderElement?: (props: RenderElementProps) => JSX.Element | undefined;
}

export type UseEditorOptions = Pick<EditorProps, 'initialValue' | 'onChangeValue' | 'collaborative' | 'collabUrl'>;

export interface PreviewProps {
  data: Document;
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
  data: Document;
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

export interface Section {
  id: string;
  value: Descendant[];
  editable?: boolean;
}

export interface CompositeEditorProps {
  sections: Section[];
  onChangeSections?: (sections: Section[]) => void;
  className?: string;
}
