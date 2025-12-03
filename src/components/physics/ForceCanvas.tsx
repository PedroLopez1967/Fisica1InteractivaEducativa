import React, { useEffect, useRef } from 'react';

interface ForceCanvasProps {
    mass: number;
    force: number;
    angle: number;
    frictionCoeff: number;
    isMoving: boolean;
    acceleration: number;
    time: number;
    normalForce: number;
    frictionForce: number;
}


const ForceCanvas: React.FC<ForceCanvasProps> = ({
    mass,
    force,
    angle,
    frictionCoeff,
    isMoving,
    acceleration,
    time,
    normalForce,
    frictionForce
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Physics constants for visualization
    const BLOCK_SIZE = 60;
    const GROUND_Y = 350;
    const PIXELS_PER_METER = 10; // Scale for movement

    const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string, label: string) => {
        const headlen = 10;
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

        ctx.fillStyle = color;
        ctx.font = '14px monospace';
        ctx.fillText(label, toX + 10, toY);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        // Calculate position based on acceleration and time: x = 1/2 * a * t^2
        // We wrap around the screen or clamp it
        let positionX = 100 + (0.5 * acceleration * time * time) * PIXELS_PER_METER;

        // Loop position for continuous visual
        if (positionX > width + BLOCK_SIZE) {
            positionX = -BLOCK_SIZE + (positionX % (width + BLOCK_SIZE));
        }

        const centerX = positionX;
        const centerY = GROUND_Y - BLOCK_SIZE / 2;

        // Clear
        ctx.clearRect(0, 0, width, height);

        // Draw Ground
        ctx.fillStyle = '#333';
        ctx.fillRect(0, GROUND_Y, width, 10);

        // Draw Surface details (lines to show motion)
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        for (let i = 0; i < width; i += 40) {
            ctx.beginPath();
            ctx.moveTo(i - (isMoving ? (time * 50) % 40 : 0), GROUND_Y);
            ctx.lineTo(i - 20 - (isMoving ? (time * 50) % 40 : 0), GROUND_Y + 10);
            ctx.stroke();
        }

        // Draw Block
        ctx.fillStyle = '#4A90E2'; // Blue block
        ctx.fillRect(centerX - BLOCK_SIZE / 2, centerY - BLOCK_SIZE / 2, BLOCK_SIZE, BLOCK_SIZE);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(centerX - BLOCK_SIZE / 2, centerY - BLOCK_SIZE / 2, BLOCK_SIZE, BLOCK_SIZE);

        // Draw Mass Label
        ctx.fillStyle = '#fff';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${mass}kg`, centerX, centerY + 6);

        // --- Draw Forces ---
        const scale = 1.5; // Visual scale for vectors
        const rad = (angle * Math.PI) / 180;

        // Weight (mg) - Always down
        drawArrow(ctx, centerX, centerY, centerX, centerY + (mass * 9.8 * 0.5), '#EF4444', `mg (${(mass * 9.8).toFixed(1)} N)`);

        // Normal Force (N) - Up
        if (normalForce > 0) {
            drawArrow(ctx, centerX, centerY + BLOCK_SIZE / 2, centerX, centerY + BLOCK_SIZE / 2 - (normalForce * 0.5), '#10B981', `N (${normalForce.toFixed(1)} N)`);
        }

        // Applied Force (F)
        if (force > 0) {
            const fx = force * Math.cos(rad);
            const fy = force * Math.sin(rad); // Up is positive Y in physics, but negative Y in canvas
            // Draw from center
            drawArrow(ctx, centerX, centerY, centerX + fx * scale, centerY - fy * scale, '#F59E0B', `F (${force.toFixed(1)} N)`);
        }

        // Friction (fr) - Opposite to motion/force
        if (Math.abs(frictionForce) > 0) {
            // Friction opposes motion. 
            // frictionForce has same sign as motion (fx).
            // So we draw opposite to frictionForce.
            const frictionScale = 1.5;
            drawArrow(ctx, centerX, centerY + BLOCK_SIZE / 2, centerX - (frictionForce * frictionScale), centerY + BLOCK_SIZE / 2, '#A855F7', `fr (${Math.abs(frictionForce).toFixed(1)} N)`);
        }

    }, [mass, force, angle, frictionCoeff, isMoving, acceleration, time, normalForce, frictionForce]);

    return (
        <div className="w-full bg-gray-900/50 rounded-lg border border-gray-700 overflow-hidden">
            <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="w-full h-full"
            />
        </div>
    );
};

export default ForceCanvas;
