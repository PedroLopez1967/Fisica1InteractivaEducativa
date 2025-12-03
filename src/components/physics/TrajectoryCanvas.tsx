import React, { useEffect, useRef } from 'react';

interface TrajectoryCanvasProps {
    v0: number;
    angle: number;
    gravity?: number;
    time: number;
}

const TrajectoryCanvas: React.FC<TrajectoryCanvasProps> = ({
    v0,
    angle,
    gravity = 9.8,
    time,
}) => {
    console.log('TrajectoryCanvas render time:', time);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Physics constants
    // Physics constants
    // Calculate max range and height to determine scale
    const rad = (angle * Math.PI) / 180;
    const maxRange = (v0 * v0 * Math.sin(2 * rad)) / gravity;
    const maxHeight = (v0 * v0 * Math.sin(rad) * Math.sin(rad)) / (2 * gravity);

    // Canvas dimensions
    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 500;
    const PADDING = 50;

    // Calculate scale to fit trajectory with padding
    // Use the smaller scale to ensure it fits both width and height
    const scaleX = (CANVAS_WIDTH - 2 * PADDING) / (maxRange || 1); // Avoid divide by zero
    const scaleY = (CANVAS_HEIGHT - 2 * PADDING) / (maxHeight || 1);
    const SCALE = Math.min(scaleX, scaleY, 10); // Cap max scale at 10 for small values

    const ORIGIN_X = PADDING;
    const ORIGIN_Y = CANVAS_HEIGHT - PADDING;

    const calculatePosition = (t: number) => {
        const rad = (angle * Math.PI) / 180;
        const x = v0 * Math.cos(rad) * t;
        const y = v0 * Math.sin(rad) * t - 0.5 * gravity * t * t;
        return { x, y };
    };

    const draw = (ctx: CanvasRenderingContext2D, currentTime: number) => {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw axes
        ctx.beginPath();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        // X axis
        ctx.moveTo(ORIGIN_X, ORIGIN_Y);
        ctx.lineTo(width - 20, ORIGIN_Y);
        // Y axis
        ctx.moveTo(ORIGIN_X, ORIGIN_Y);
        ctx.lineTo(ORIGIN_X, 20);
        ctx.stroke();

        // Draw trajectory path (dotted line)
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 217, 255, 0.5)'; // Secondary color transparent
        ctx.setLineDash([5, 5]);

        // Calculate max time for trajectory (when y hits 0 again)
        const rad = (angle * Math.PI) / 180;
        const totalTime = (2 * v0 * Math.sin(rad)) / gravity;

        for (let t = 0; t <= totalTime; t += 0.1) {
            const pos = calculatePosition(t);
            const canvasX = ORIGIN_X + pos.x * SCALE;
            const canvasY = ORIGIN_Y - pos.y * SCALE;
            if (t === 0) ctx.moveTo(canvasX, canvasY);
            else ctx.lineTo(canvasX, canvasY);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw projectile at current time
        const currentPos = calculatePosition(currentTime);
        const projX = ORIGIN_X + currentPos.x * SCALE;
        const projY = ORIGIN_Y - currentPos.y * SCALE;

        // Only draw if above ground
        if (currentPos.y >= -1) { // Tolerance for floating point
            ctx.beginPath();
            ctx.fillStyle = '#00FF88'; // Accent color
            ctx.arc(projX, projY, 8, 0, Math.PI * 2);
            ctx.fill();

            // Draw velocity vector (optional visualization)
            const vx = v0 * Math.cos(rad);
            const vy = v0 * Math.sin(rad) - gravity * currentTime;

            ctx.beginPath();
            ctx.strokeStyle = '#FF6B35'; // Orange for velocity
            ctx.lineWidth = 2;
            ctx.moveTo(projX, projY);
            ctx.lineTo(projX + vx, projY - vy); // Simple scale for vector
            ctx.stroke();
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        draw(ctx, time);
    }, [time, v0, angle, gravity]);

    return (
        <div className="relative w-full aspect-[16/10] bg-gray-900/50 rounded-lg border border-gray-700 overflow-hidden">
            <canvas
                ref={canvasRef}
                width={800}
                height={500}
                className="w-full h-full"
            />
            <div className="absolute bottom-4 right-4 text-white font-mono text-sm bg-black/50 p-2 rounded">
                t: {time.toFixed(2)}s
            </div>
        </div>
    );
};

export default TrajectoryCanvas;
