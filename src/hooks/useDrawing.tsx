import { useRef, useState, useCallback } from 'react';
import { DrawingOptions } from '@/types/drawing';
import { useDrawingState } from './useDrawingState';

export const useDrawing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [options, setOptions] = useState<DrawingOptions>({
    color: '#000000',
    size: 5,
    tool: 'brush',
  });

  const {
    saveState,
    undo,
    redo,
    canUndo,
    canRedo
  } = useDrawingState();

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = options.tool === 'eraser' ? '#ffffff' : options.color;
    ctx.lineWidth = options.size;
  }, [options]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing]);

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      if (canvas) {
        saveState(canvas);
      }
      setIsDrawing(false);
    }
  }, [isDrawing, saveState]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState(canvas);
  }, [saveState]);

  const downloadDrawing = useCallback((background: 'white' | 'transparent' = 'white') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a temporary canvas to handle the background
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    if (background === 'white') {
      tempCtx.fillStyle = '#ffffff';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    }

    // Draw the original canvas content onto the temporary canvas
    tempCtx.drawImage(canvas, 0, 0);

    // Get the image data with the chosen background
    const dataUrl = tempCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = dataUrl;
    link.click();
  }, []);

  return {
    canvasRef,
    options,
    setOptions,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    downloadDrawing,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};