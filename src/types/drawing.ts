export interface DrawingOptions {
  color: string;
  size: number;
  tool: 'brush' | 'eraser';
}

export interface DrawingState {
  dataUrl: string;
  timestamp: number;
}