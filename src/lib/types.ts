export interface CSVData {
  headers: string[];
  rows: string[][];
}

export interface PromptOption {
  id: string;
  text: string;
  isActive: boolean;
}

export interface SummaryPanelProps {
  summary: string;
  onChange: (summary: string) => void;
  onReset: () => void;
  isLoading: boolean;
  error: string | null;
}

export interface PromptPanelProps {
  onSubmit: (prompts: string[]) => void;
  isLoading: boolean;
}

export interface FileUploaderProps {
  onUpload: (data: CSVData) => void;
} 