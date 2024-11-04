import { useState, useCallback } from 'react';
import { DrawingState } from '@/types/drawing';

export const useDrawingState = () => {
  const [undoStack, setUndoStack] = useState<DrawingState[]>([]);
  const [redoStack, setRedoStack] = useState<DrawingState[]>([]);

  const saveState = useCallback((canvas: HTMLCanvasElement) => {
    const dataUrl = canvas.toDataURL();
    const newState: DrawingState = { dataUrl, timestamp: Date.now() };
    setUndoStack(prev => [...prev, newState]);
    setRedoStack([]);
  }, []);

  const undo = useCallback((canvas: HTMLCanvasElement) => {
    if (undoStack.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentState = undoStack[undoStack.length - 1];
    const previousState = undoStack.length > 1 ? undoStack[undoStack.length - 2] : null;

    setRedoStack(prev => [...prev, currentState]);
    setUndoStack(prev => prev.slice(0, -1));

    if (previousState) {
      const img = new Image();
      img.src = previousState.dataUrl;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [undoStack]);

  const redo = useCallback((canvas: HTMLCanvasElement) => {
    if (redoStack.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nextState = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, nextState]);
    setRedoStack(prev => prev.slice(0, -1));

    const img = new Image();
    img.src = nextState.dataUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }, [redoStack]);

  return {
    undoStack,
    redoStack,
    saveState,
    undo,
    redo,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
  };
};