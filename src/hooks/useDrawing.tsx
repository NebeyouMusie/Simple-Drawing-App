import { useRef, useState, useCallback } from 'react';

interface DrawingOptions {
  color: string;
  size: number;
  tool: 'brush' | 'eraser' | 'rectangle' | 'circle' | 'line';
}

interface DrawingState {
  dataUrl: string;
}

export const useDrawing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [undoStack, setUndoStack] = useState<DrawingState[]>([]);
  const [redoStack, setRedoStack] = useState<DrawingState[]>([]);
  const [options, setOptions] = useState<DrawingOptions>({
    color: '#000000',
    size: 5,
    tool: 'brush',
  });

  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    setUndoStack(prev => [...prev, { dataUrl }]);
    setRedoStack([]);
  }, []);

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
      saveState();
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
      const lastState = undoStack[undoStack.length - 1];
      if (lastState) {
        const img = new Image();
        img.src = lastState.dataUrl;
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          ctx.beginPath();
          ctx.strokeStyle = options.color;
          ctx.lineWidth = options.size;

          switch (options.tool) {
            case 'rectangle':
              ctx.strokeRect(startPoint.x, startPoint.y, x - startPoint.x, y - startPoint.y);
              break;
            case 'circle':
              const radius = Math.sqrt(Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2));
              ctx.beginPath();
              ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
              ctx.stroke();
              break;
            case 'line':
              ctx.beginPath();
              ctx.moveTo(startPoint.x, startPoint.y);
              ctx.lineTo(x, y);
              ctx.stroke();
              break;
          }
        };
      }
    }
  }, [isDrawing, options, startPoint, undoStack]);

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      saveState();
      setIsDrawing(false);
      setStartPoint(null);
    }
  }, [isDrawing, saveState]);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentState = undoStack[undoStack.length - 1];
    const previousState = undoStack[undoStack.length - 2];

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

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

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

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState();
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
    canUndo: undoStack.length > 1,
    canRedo: redoStack.length > 0,
  };
};