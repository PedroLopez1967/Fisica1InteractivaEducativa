import React, { useState, useEffect, useRef } from 'react';
import TrajectoryCanvas from '../components/physics/TrajectoryCanvas';
import { Link } from 'react-router-dom';
import { calculateProjectileValues, checkAnswer } from '../utils/physics-calculations';

const Problem2: React.FC = () => {
    const [v0, setV0] = useState(50);
    const [angle, setAngle] = useState(45);
    const [time, setTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const [userAnswers, setUserAnswers] = useState({
        posY: '',
        velY: '',
        timeMax: ''
    });

    const [validationState, setValidationState] = useState<{
        posY: boolean | null;
        velY: boolean | null;
        timeMax: boolean | null;
    }>({
        posY: null,
        velY: null,
        timeMax: null
    });

    console.log('Render - Validation State:', validationState);



    // Animation Loop
    const timeSpanRef = useRef<HTMLSpanElement>(null);

    // Animation Loop
    useEffect(() => {
        if (!isPlaying) {
            return;
        }

        let animationFrameId: number;
        let previousTime: number | undefined;

        const animate = (timestamp: number) => {
            if (previousTime === undefined) {
                previousTime = timestamp;
            }

            const rawDeltaTime = (timestamp - previousTime) / 1000;
            previousTime = timestamp;

            // Clamp deltaTime and apply slow motion (0.5x speed) for better visibility
            const deltaTime = Math.min(rawDeltaTime, 0.1) * 0.5;

            setTime(prevTime => {
                const newTime = prevTime + deltaTime;
                const totalFlightTime = (2 * v0 * Math.sin(angle * Math.PI / 180)) / 9.8;

                // Update text directly for smooth performance
                if (timeSpanRef.current) {
                    timeSpanRef.current.innerText = `${newTime.toFixed(2)}s`;
                }

                if (newTime >= totalFlightTime) {
                    setIsPlaying(false);
                    if (timeSpanRef.current) {
                        timeSpanRef.current.innerText = `${totalFlightTime.toFixed(2)}s`;
                    }
                    return totalFlightTime;
                }
                return newTime;
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isPlaying, v0, angle]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserAnswers(prev => ({ ...prev, [name]: value }));
        setValidationState(prev => ({ ...prev, [name]: null }));
    };

    const validateAnswers = () => {
        const correctValues = calculateProjectileValues(v0, angle, 2);
        console.log('Correct Values:', correctValues);
        console.log('User Answers:', userAnswers);

        const results = {
            posY: checkAnswer(userAnswers.posY, correctValues.posY),
            velY: checkAnswer(userAnswers.velY, correctValues.velY),
            timeMax: checkAnswer(userAnswers.timeMax, correctValues.timeMax),
        };
        console.log('Validation Results:', results);

        setValidationState(results);
    };

    const getInputClass = (isValid: boolean | null) => {
        const base = "w-full bg-gray-900 border rounded px-3 py-2 text-white outline-none";
        if (isValid === true) return `${base} border-green-500 bg-green-900/20`;
        if (isValid === false) return `${base} border-red-500 bg-red-900/20`;
        return `${base} border-gray-600 focus:border-secondary`;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-heading text-secondary">Misión: Base Lunar</h1>
                <Link to="/" className="text-gray-400 hover:text-white text-sm md:text-base">← Volver al Dashboard</Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Simulation Area */}
                <div className="lg:col-span-2 space-y-4">
                    <TrajectoryCanvas
                        v0={v0}
                        angle={angle}
                        time={time}
                    />

                    <div className="flex gap-4 bg-gray-800/50 p-4 rounded-lg">
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="px-6 py-2 bg-secondary text-black font-bold rounded hover:bg-secondary/80 transition"
                        >
                            {isPlaying ? '⏸ Pausa' : '▶ Reproducir'}
                        </button>
                        <button
                            onClick={() => { setIsPlaying(false); setTime(0); }}
                            className="px-6 py-2 bg-gray-700 text-white font-bold rounded hover:bg-gray-600 transition"
                        >
                            ⏮ Reiniciar
                        </button>
                        <div className="flex items-center gap-4 ml-auto">
                            <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded border border-gray-600">
                                <span className="text-gray-400 font-bold">t:</span>
                                <span
                                    ref={timeSpanRef}
                                    className="text-xl font-bold text-accent font-mono w-16 text-center"
                                >
                                    {time.toFixed(2)}s
                                </span>
                            </div>
                            <div className="text-xs text-gray-400 font-mono">
                                / T_total: {((2 * v0 * Math.sin(angle * Math.PI / 180)) / 9.8).toFixed(2)}s
                            </div>
                            <label className="text-sm">
                                V0 (m/s):
                                <input
                                    type="number"
                                    value={v0}
                                    onChange={(e) => setV0(Number(e.target.value))}
                                    className="ml-2 w-16 bg-gray-900 border border-gray-700 rounded px-2 py-1"
                                />
                            </label>
                            <label className="text-sm">
                                Ángulo (°):
                                <input
                                    type="number"
                                    value={angle}
                                    onChange={(e) => setAngle(Number(e.target.value))}
                                    className="ml-2 w-16 bg-gray-900 border border-gray-700 rounded px-2 py-1"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Problem Solving Area */}
                <div className="space-y-6 bg-gray-800/30 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-bold text-accent">Análisis de Trayectoria</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-300 mb-1">a) Posición Y en t=2s (m)</label>
                            <div className="flex gap-2">
                                <input
                                    name="posY"
                                    value={userAnswers.posY}
                                    onChange={handleInputChange}
                                    className={getInputClass(validationState.posY)}
                                    placeholder="Calcula y(2)"
                                />
                                <button className="px-3 py-2 bg-gray-700 rounded hover:bg-gray-600">?</button>
                            </div>
                            {validationState.posY === false && <p className="text-xs text-red-400 mt-1">Intenta de nuevo. y = v0*sin(θ)*t - 0.5*g*t²</p>}
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-1">b) Velocidad Y en t=2s (m/s)</label>
                            <input
                                name="velY"
                                value={userAnswers.velY}
                                onChange={handleInputChange}
                                className={getInputClass(validationState.velY)}
                                placeholder="Calcula vy(2)"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-1">c) Tiempo altura máxima (s)</label>
                            <input
                                name="timeMax"
                                value={userAnswers.timeMax}
                                onChange={handleInputChange}
                                className={getInputClass(validationState.timeMax)}
                                placeholder="Calcula t_max"
                            />
                        </div>

                        <button
                            onClick={validateAnswers}
                            className="w-full py-3 bg-primary border border-secondary text-secondary font-bold rounded hover:bg-secondary hover:text-black transition-all"
                        >
                            Verificar Respuestas
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Problem2;
