
export type ContentItemType = 'heading' | 'paragraph' | 'list' | 'code' | 'table' | 'equation';

export interface ContentItem {
  type: ContentItemType;
  text?: string;
  level?: number;
  items?: string[];
  headers?: string[];
  rows?: (string | number)[][];
}

export interface Section {
  id: string;
  title: string;
  content: ContentItem[];
}
