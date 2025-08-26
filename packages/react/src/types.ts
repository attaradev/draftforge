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
}

export interface PreviewProps {
  data: EditorJsData;
  className?: string;
}

export interface ExportButtonProps {
  data: EditorJsData;
  filename?: string;
  exportUrl: string;    // POST endpoint
  pollBaseUrl: string;  // GET base, i.e. `${pollBaseUrl}/${id}`
  onReady?: (downloadUrl: string) => void;
  className?: string;
}
