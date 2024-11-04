import React, { useEffect, useRef } from 'react';
import { useDrawing } from '@/hooks/useDrawing';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';

export const Canvas = () => {
  const {
    canvasRef,
    options,
    setOptions,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    downloadDrawing,
  } = useDrawing();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const handleDownload = () => {
    downloadDrawing();
    toast({
      title: "Success!",
      description: "Your drawing has been downloaded.",
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between p-4 bg-white shadow-sm">
        <div className="flex items-center space-x-4">
          <input
            type="color"
            value={options.color}
            onChange={(e) => setOptions({ ...options, color: e.target.value })}
            className="w-10 h-10 rounded cursor-pointer"
          />
          <div className="w-32">
            <Slider
              value={[options.size]}
              onValueChange={(value) => setOptions({ ...options, size: value[0] })}
              min={1}
              max={20}
              step={1}
            />
          </div>
          <Button
            variant={options.tool === 'brush' ? 'default' : 'outline'}
            onClick={() => setOptions({ ...options, tool: 'brush' })}
          >
            Brush
          </Button>
          <Button
            variant={options.tool === 'eraser' ? 'default' : 'outline'}
            onClick={() => setOptions({ ...options, tool: 'eraser' })}
          >
            Eraser
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={clearCanvas}>
            Clear
          </Button>
          <Button onClick={handleDownload}>
            Download
          </Button>
        </div>
      </div>
      <div className="flex-1 relative bg-white">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 touch-none"
        />
      </div>
    </div>
  );
};