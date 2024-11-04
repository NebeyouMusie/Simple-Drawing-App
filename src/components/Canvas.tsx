import React, { useEffect } from 'react';
import { useDrawing } from '@/hooks/useDrawing';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { Undo2, Redo2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
    undo,
    redo,
    canUndo,
    canRedo,
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

  const handleDownload = (background: 'white' | 'transparent') => {
    downloadDrawing(background);
    toast({
      title: "Success!",
      description: "Your drawing has been downloaded.",
    });
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      undo(canvas);
    }
  };

  const handleRedo = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      redo(canvas);
    }
  };

  return (
    <div className="flex flex-col h-screen font-poppins">
      <div className="flex flex-wrap items-center justify-between p-4 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
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
          <div className="flex items-center gap-2 border-l pl-4">
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
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <div className="flex items-center gap-2 border-r pr-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleUndo}
              disabled={!canUndo}
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRedo}
              disabled={!canRedo}
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" onClick={clearCanvas}>
            Clear
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Download</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Choose Background</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <RadioGroup defaultValue="white" className="gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="white" id="white" onClick={() => handleDownload('white')} />
                    <Label htmlFor="white">White Background</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="transparent" id="transparent" onClick={() => handleDownload('transparent')} />
                    <Label htmlFor="transparent">Transparent Background</Label>
                  </div>
                </RadioGroup>
              </div>
            </DialogContent>
          </Dialog>
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