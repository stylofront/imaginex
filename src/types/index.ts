export interface ProcessedFile {
  id: string;
  file: File;
  previewUrl: string;
  originalSize: number;
  originalWidth?: number;
  originalHeight?: number;
  processedBlob?: Blob;
  processedUrl?: string;
  processedSize?: number;
  processedWidth?: number;
  processedHeight?: number;
  status: 'idle' | 'processing' | 'done' | 'error';
  progress?: number;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export interface ToolInfo {
  id: string;
  title: string;
  description: string;
  category: 'convert' | 'optimize' | 'edit' | 'analyze';
  badge?: string;
  href: string;
  iconName: string;
  highlights: string[];
  supportedFormats: string[];
}
