import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EnergyCanvas from '../components/physics/EnergyCanvas';
import { calculateEnergy, calculateFreeFall } from '../utils/physics-calculations';

const Problem4: React.FC = () => {
    // Parameters
    const [mass, setMass] = useState(10); // kg
    const [initialHeight, setInitialHeight] = useState(50); // m

    // Simulation State
    const [isPlaying, setIsPlaying] = useState(false);
    const [time, setTime] = useState(0);
    const [currentHeight, setCurrentHeight] = useState(50);
    const [velocity, setVelocity] = useState(0);

    // Energy State
    const [energy, setEnergy] = useState({ pe: 0, ke: 0, total: 0, velocity: 0 });

    // Reset when parameters change
    useEffect(() => {
        setIsPlaying(false);
        setTime(0);
        setCurrentHeight(initialHeight);
        setVelocity(0);

        // Initial Energy
        const res = calculateEnergy(mass, initialHeight, 0);
        setEnergy(res);
    }, [mass, initialHeight]);

    // Animation Loop
    useEffect(() => {
        if (!isPlaying) return;

        let animationFrameId: number;
        let previousTime: number | undefined;

        const animate = (timestamp: number) => {
            if (previousTime === undefined) previousTime = timestamp;
            const deltaTime = (timestamp - previousTime) / 1000;
            previousTime = timestamp;

            // Update Time
            setTime(prevTime => {
                const newTime = prevTime + deltaTime;

                // Calculate Physics
                const { height, velocity } = calculateFreeFall(initialHeight, newTime);

                setCurrentHeight(height);
                setVelocity(velocity);

                const energyRes = calculateEnergy(mass, height, velocity);
                setEnergy(energyRes);

                // Stop if hit ground
                if (height <= 0) {
                    setIsPlaying(false);
                    return newTime; // Keep final time
                }

                return newTime;
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isPlaying, initialHeight, mass]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-heading text-secondary">Torre de Energía: Conservación</h1>
                <Link to="/" className="text-gray-400 hover:text-white">← Volver al Dashboard</Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Simulation Area */}
                <div className="lg:col-span-2 space-y-4">
                    <EnergyCanvas
                        height={currentHeight}
                        maxHeight={initialHeight}
                        pe={energy.pe}
                        ke={energy.ke}
                        totalEnergy={energy.total}
                    />

                    <div className="flex gap-4 bg-gray-800/50 p-4 rounded-lg items-center">
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="px-6 py-2 bg-secondary text-black font-bold rounded hover:bg-secondary/80 transition"
                            disabled={currentHeight <= 0 && !isPlaying}
                        >
                            {isPlaying ? '⏸ Pausa' : (currentHeight <= 0 ? 'Terminado' : '▶ Soltar')}
                        </button>
                        <button
                            onClick={() => {
                                setIsPlaying(false);
                                setTime(0);
                                setCurrentHeight(initialHeight);
                                setVelocity(0);
                                const res = calculateEnergy(mass, initialHeight, 0);
                                setEnergy(res);
                            }}
                            className="px-6 py-2 bg-gray-700 text-white font-bold rounded hover:bg-gray-600 transition"
                        >
                            ⏮ Reiniciar
                        </button>

                        <div className="ml-auto flex gap-6 text-sm font-mono text-gray-300">
                            <div>
                                <span className="text-gray-500">Tiempo:</span> {time.toFixed(2)} s
                            </div>
                            <div>
                                <span className="text-gray-500">Altura:</span> {currentHeight.toFixed(2)} m
                            </div>
                            <div>
                                <span className="text-gray-500">Velocidad:</span> {velocity.toFixed(2)} m/s
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls Area */}
                <div className="space-y-6 bg-gray-800/30 p-6 rounded-lg border border-gray-700 h-fit">
                    <h2 className="text-xl font-bold text-accent">Configuración</h2>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Altura Inicial (m)</span>
                                <span className="font-mono font-bold text-secondary">{initialHeight} m</span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="100"
                                step="5"
                                value={initialHeight}
                                onChange={(e) => setInitialHeight(Number(e.target.value))}
                                className="w-full accent-secondary"
                                disabled={isPlaying}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Masa (kg)</span>
                                <span className="font-mono font-bold text-blue-400">{mass} kg</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="50"
                                value={mass}
                                onChange={(e) => setMass(Number(e.target.value))}
                                className="w-full accent-blue-500"
                                disabled={isPlaying}
                            />
                        </div>

                        <div className="border-t border-gray-700 pt-4 space-y-3">
                            <h3 className="font-bold text-gray-300">Datos de Energía</h3>
                            <div className="space-y-2 font-mono text-sm">
                                <div className="flex justify-between">
                                    <span className="text-blue-400">Potencial (PE):</span>
                                    <span>{energy.pe.toFixed(0)} J</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-400">Cinética (KE):</span>
                                    <span>{energy.ke.toFixed(0)} J</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-700 pt-1 font-bold">
                                    <span className="text-purple-400">Total (E):</span>
                                    <span>{energy.total.toFixed(0)} J</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-900/20 p-4 rounded border border-blue-500/30 text-sm text-blue-200">
                            <p>
                                <strong>Principio:</strong> La energía no se crea ni se destruye, solo se transforma.
                            </p>
                            <p className="mt-2">
                                Al caer, la energía potencial (altura) se convierte en energía cinética (velocidad). La suma total permanece constante.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Problem4;
