import { useRef, useState, useCallback } from 'react';
import { DrawingOptions } from '@/types/drawing';
import { drawShape } from './useDrawingTools';
import { useDrawingState } from './useDrawingState';

export const useDrawing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
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

    if (options.tool === 'brush' || options.tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = options.tool === 'eraser' ? '#ffffff' : options.color;
      ctx.lineWidth = options.size;
    } else {
      setStartPoint({ x, y });
      saveState(canvas);
    }
  }, [options, saveState]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    if (options.tool === 'brush' || options.tool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (startPoint) {
      // Get the last saved state
      const lastState = new Image();
      lastState.src = canvas.toDataURL();
      lastState.onload = () => {
        // Clear the canvas and restore the last state
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(lastState, 0, 0);
        // Draw the new shape
        drawShape(ctx, startPoint, { x, y }, options);
      };
    }
  }, [isDrawing, options, startPoint]);

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      if (canvas) {
        saveState(canvas);
      }
      setIsDrawing(false);
      setStartPoint(null);
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

  const downloadDrawing = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = dataUrl;
    link.click();
  }, []);

  const handleUndo = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      undo(canvas);
    }
  }, [undo]);

  const handleRedo = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      redo(canvas);
    }
  }, [redo]);

  return {
    canvasRef,
    options,
    setOptions,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    downloadDrawing,
    undo: handleUndo,
    redo: handleRedo,
    canUndo,
    canRedo,
  };
};