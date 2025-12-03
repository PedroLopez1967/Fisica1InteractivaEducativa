import React, { useEffect, useRef } from 'react';

interface Vector {
    magnitude: number;
    angle: number; // degrees
    color: string;
    label: string;
}

interface VectorCanvasProps {
    vectorA: Vector;
    vectorB: Vector;
    showResultant?: boolean;
}

const VectorCanvas: React.FC<VectorCanvasProps> = ({
    vectorA,
    vectorB,
    showResultant = false,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string, label: string) => {
        const headlen = 10; // length of head in pixels
        const dx = toX - fromX;
        const dy = toY - fromY;
        const angle = Math.atan2(dy, dx);

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
        ctx.fill();

        // Label
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px monospace';
        ctx.fillText(label, toX + 10, toY);
    };

    const draw = (ctx: CanvasRenderingContext2D) => {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw Grid
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 0; x <= width; x += 50) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }
        for (let y = 0; y <= height; y += 50) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }
        ctx.stroke();

        // Draw Axes
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, height);
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();

        // Calculate Scale (auto-fit)
        // Find max extent
        const radA = (vectorA.angle * Math.PI) / 180;
        const ax = vectorA.magnitude * Math.cos(radA);
        const ay = vectorA.magnitude * Math.sin(radA);

        const radB = (vectorB.angle * Math.PI) / 180;
        const bx = vectorB.magnitude * Math.cos(radB);
        const by = vectorB.magnitude * Math.sin(radB);

        const rx = ax + bx;
        const ry = ay + by;

        const maxMag = Math.max(
            Math.abs(ax), Math.abs(ay),
            Math.abs(bx), Math.abs(by),
            showResultant ? Math.abs(rx) : 0,
            showResultant ? Math.abs(ry) : 0
        );

        const scale = Math.min(width, height) / 2 / (maxMag * 1.2 || 10); // 1.2 for padding

        // Draw Vector A
        const screenAx = centerX + ax * scale;
        const screenAy = centerY - ay * scale; // Y is inverted on canvas
        drawArrow(ctx, centerX, centerY, screenAx, screenAy, vectorA.color, vectorA.label);

        // Draw Vector B (from origin for comparison, or tip-to-tail? Let's do from origin for now as standard position)
        const screenBx = centerX + bx * scale;
        const screenBy = centerY - by * scale;
        drawArrow(ctx, centerX, centerY, screenBx, screenBy, vectorB.color, vectorB.label);

        // Draw Resultant
        if (showResultant) {
            const screenRx = centerX + rx * scale;
            const screenRy = centerY - ry * scale;
            drawArrow(ctx, centerX, centerY, screenRx, screenRy, '#00FF88', 'R');

            // Optional: Draw parallelogram lines
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.moveTo(screenAx, screenAy);
            ctx.lineTo(screenRx, screenRy);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(screenBx, screenBy);
            ctx.lineTo(screenRx, screenRy);
            ctx.stroke();

            ctx.setLineDash([]);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        draw(ctx);
    }, [vectorA, vectorB, showResultant]);

    return (
        <div className="relative w-full aspect-square bg-gray-900/50 rounded-lg border border-gray-700 overflow-hidden">
            <canvas
                ref={canvasRef}
                width={600}
                height={600}
                className="w-full h-full"
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                Escala Automática
            </div>
        </div>
    );
};

export default VectorCanvas;
