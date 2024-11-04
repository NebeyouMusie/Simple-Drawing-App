import { DrawingOptions } from '@/types/drawing';

export const drawShape = (
  ctx: CanvasRenderingContext2D,
  startPoint: { x: number; y: number },
  endPoint: { x: number; y: number },
  options: DrawingOptions
) => {
  ctx.beginPath();
  ctx.strokeStyle = options.color;
  ctx.lineWidth = options.size;

  switch (options.tool) {
    case 'rectangle':
      ctx.strokeRect(startPoint.x, startPoint.y, endPoint.x - startPoint.x, endPoint.y - startPoint.y);
      break;
    case 'circle':
      const radius = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2));
      ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
      break;
    case 'triangle':
      const height = endPoint.y - startPoint.y;
      const base = endPoint.x - startPoint.x;
      ctx.moveTo(startPoint.x + base / 2, startPoint.y); // Top point
      ctx.lineTo(startPoint.x, startPoint.y + height); // Bottom left
      ctx.lineTo(startPoint.x + base, startPoint.y + height); // Bottom right
      ctx.closePath();
      ctx.stroke();
      break;
    case 'line':
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x, endPoint.y);
      ctx.stroke();
      break;
  }
};