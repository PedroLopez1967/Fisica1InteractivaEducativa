import React, { useEffect, useRef } from 'react';

interface EnergyCanvasProps {
    height: number; // Current height of the object (m)
    maxHeight: number; // Initial/Max height (m)
    pe: number; // Potential Energy (J)
    ke: number; // Kinetic Energy (J)
    totalEnergy: number; // Total Energy (J)
}

const EnergyCanvas: React.FC<EnergyCanvasProps> = ({
    height,
    maxHeight,
    pe,
    ke,
    totalEnergy
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const draw = (ctx: CanvasRenderingContext2D) => {
        const width = ctx.canvas.width;
        const heightPx = ctx.canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, heightPx);

        // --- 1. Draw Scene (Tower & Ball) ---
        const sceneWidth = width * 0.6;
        const groundY = heightPx - 50;
        const scaleY = (groundY - 50) / maxHeight; // Scale meters to pixels

        // Draw Ground
        ctx.fillStyle = '#4B5563'; // Gray-600
        ctx.fillRect(0, groundY, sceneWidth, 50);

        // Draw Tower
        ctx.fillStyle = '#374151'; // Gray-700
        ctx.fillRect(50, groundY - maxHeight * scaleY, 40, maxHeight * scaleY);

        // Draw Ball
        const ballRadius = 15;
        const ballX = 150; // Fixed X position for the ball drop
        const ballY = groundY - height * scaleY - ballRadius;

        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#EF4444'; // Red-500
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();

        // Draw Height Marker
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = '#9CA3AF'; // Gray-400
        ctx.moveTo(50, ballY + ballRadius);
        ctx.lineTo(ballX, ballY + ballRadius);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px monospace';
        ctx.fillText(`h = ${height.toFixed(2)} m`, ballX + 20, ballY + 5);


        // --- 2. Draw Energy Bars ---
        const barStartX = sceneWidth + 20;
        const barWidth = 40;
        const maxBarHeight = heightPx - 100;
        const barGroundY = heightPx - 50;

        // Helper to draw bar
        const drawBar = (x: number, value: number, color: string, label: string) => {
            // Normalize height based on Total Energy (plus a bit of buffer)
            // If totalEnergy is 0 (start), avoid division by zero
            const maxE = totalEnergy > 0 ? totalEnergy : 100;
            const h = (value / maxE) * maxBarHeight;

            // Bar Background
            ctx.fillStyle = '#1F2937'; // Gray-800
            ctx.fillRect(x, barGroundY - maxBarHeight, barWidth, maxBarHeight);

            // Bar Value
            ctx.fillStyle = color;
            ctx.fillRect(x, barGroundY - h, barWidth, h);

            // Label
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(label, x + barWidth / 2, barGroundY + 20);

            // Value Text
            ctx.font = '10px monospace';
            ctx.fillText(value.toFixed(0), x + barWidth / 2, barGroundY - h - 5);
        };

        drawBar(barStartX, pe, '#3B82F6', 'PE'); // Blue
        drawBar(barStartX + 60, ke, '#10B981', 'KE'); // Green
        drawBar(barStartX + 120, totalEnergy, '#8B5CF6', 'Total'); // Purple

        ctx.textAlign = 'left'; // Reset alignment
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        draw(ctx);
    }, [height, maxHeight, pe, ke, totalEnergy]);

    return (
        <div className="relative w-full aspect-video bg-gray-900/50 rounded-lg border border-gray-700 overflow-hidden">
            <canvas
                ref={canvasRef}
                width={800}
                height={450}
                className="w-full h-full"
            />
        </div>
    );
};

export default EnergyCanvas;
