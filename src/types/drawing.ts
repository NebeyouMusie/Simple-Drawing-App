export interface DrawingOptions {
  color: string;
  size: number;
  tool: 'brush' | 'eraser' | 'rectangle' | 'circle' | 'triangle' | 'line';
}

export interface DrawingState {
  dataUrl: string;
  timestamp: number;
}