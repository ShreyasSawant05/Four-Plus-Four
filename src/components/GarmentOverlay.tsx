import { useRef, useEffect } from 'react';
import type { PoseData } from '../hooks/usePoseDetection';

interface GarmentOverlayProps {
  poseData: PoseData;
  garmentImage: string;
  videoWidth: number;
  videoHeight: number;
}

export default function GarmentOverlay({
  poseData,
  garmentImage,
  videoWidth,
  videoHeight,
}: GarmentOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const garmentImgRef = useRef<HTMLImageElement | null>(null);
  const animFrameRef = useRef<number>(0);

  // Preload garment image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = garmentImage;
    img.onload = () => {
      garmentImgRef.current = img;
    };

    return () => {
      garmentImgRef.current = null;
    };
  }, [garmentImage]);

  // Draw garment overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!poseData.isDetected) {
        animFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      const { centerX, centerY, width, height, rotation } = poseData;
      const isSimulated = (poseData as any).isSimulated;

      // Scale from video coords to canvas display coords
      const scaleX = canvas.width / videoWidth;
      const scaleY = canvas.height / videoHeight;

      const drawX = centerX * scaleX;
      const drawY = centerY * scaleY;
      const drawW = width * scaleX;
      const drawH = height * scaleY;

      // If simulated, draw the skeleton joints scan effect
      if (isSimulated) {
        ctx.save();
        ctx.strokeStyle = 'rgba(223, 151, 43, 0.45)'; // Amber Gold translucent bones
        ctx.lineWidth = 3;
        ctx.beginPath();
        // Shoulders line
        ctx.moveTo(drawX - drawW / 2.2, drawY - drawH * 0.15);
        ctx.lineTo(drawX + drawW / 2.2, drawY - drawH * 0.15);
        // Hips line
        ctx.moveTo(drawX - drawW / 2.8, drawY + drawH * 0.65);
        ctx.lineTo(drawX + drawW / 2.8, drawY + drawH * 0.65);
        // Spines
        ctx.moveTo(drawX - drawW / 2.2, drawY - drawH * 0.15);
        ctx.lineTo(drawX - drawW / 2.8, drawY + drawH * 0.65);
        ctx.moveTo(drawX + drawW / 2.2, drawY - drawH * 0.15);
        ctx.lineTo(drawX + drawW / 2.8, drawY + drawH * 0.65);
        ctx.stroke();

        // Joint dots
        ctx.fillStyle = '#DF972B';
        ctx.beginPath();
        ctx.arc(drawX - drawW / 2.2, drawY - drawH * 0.15, 6, 0, Math.PI * 2);
        ctx.arc(drawX + drawW / 2.2, drawY - drawH * 0.15, 6, 0, Math.PI * 2);
        ctx.arc(drawX - drawW / 2.8, drawY + drawH * 0.65, 6, 0, Math.PI * 2);
        ctx.arc(drawX + drawW / 2.8, drawY + drawH * 0.65, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw the garment overlay
      ctx.save();
      ctx.translate(drawX, drawY);
      ctx.rotate(rotation);
      ctx.globalAlpha = 0.88;

      if (garmentImgRef.current) {
        ctx.drawImage(garmentImgRef.current, -drawW / 2, -drawH * 0.15, drawW, drawH);
      } else {
        // Draw elegant vector jacket fallback (Burgundy body, Amber Gold outlines)
        ctx.fillStyle = '#840B14';
        ctx.strokeStyle = '#DF972B';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        const w = drawW * 0.85;
        const h = drawH * 0.95;

        // Draw elegant coat hanger look
        ctx.moveTo(-w / 2, -h * 0.1);
        ctx.lineTo(-w * 0.25, -h * 0.3); // Collar L
        ctx.lineTo(w * 0.25, -h * 0.3);  // Collar R
        ctx.lineTo(w / 2, -h * 0.1);    // Shoulder R
        ctx.lineTo(w / 2, h * 0.25);    // Sleeve R outer
        ctx.lineTo(w * 0.3, h * 0.25);  // Sleeve R inner
        ctx.lineTo(w * 0.3, h * 0.75);  // Blazer bottom R
        ctx.lineTo(-w * 0.3, h * 0.75); // Blazer bottom L
        ctx.lineTo(-w * 0.3, h * 0.25); // Sleeve L inner
        ctx.lineTo(-w / 2, h * 0.25);   // Sleeve L outer
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw gold double-breasted buttons
        ctx.fillStyle = '#DF972B';
        ctx.beginPath();
        ctx.arc(-w * 0.1, h * 0.15, 3.5, 0, Math.PI * 2);
        ctx.arc(w * 0.1, h * 0.15, 3.5, 0, Math.PI * 2);
        ctx.arc(-w * 0.1, h * 0.35, 3.5, 0, Math.PI * 2);
        ctx.arc(w * 0.1, h * 0.35, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Draw a Blush tag label
        ctx.fillStyle = '#FEA3DC';
        ctx.beginPath();
        // canvas roundRect fallback support
        if (ctx.roundRect) {
          ctx.roundRect(-w * 0.18, -h * 0.2, w * 0.36, h * 0.08, 3);
        } else {
          ctx.rect(-w * 0.18, -h * 0.2, w * 0.36, h * 0.08);
        }
        ctx.fill();

        // Draw tag text
        ctx.fillStyle = '#840B14';
        ctx.font = 'bold 7px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('4+4 AR', 0, -h * 0.14);
      }
      
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [poseData, videoWidth, videoHeight]);

  return (
    <canvas
      ref={canvasRef}
      width={videoWidth}
      height={videoHeight}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ transform: 'scaleX(-1)' }}
    />
  );
}
