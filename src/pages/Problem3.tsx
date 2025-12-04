import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ForceCanvas from '../components/physics/ForceCanvas';
import { calculateDynamics } from '../utils/physics-calculations';

const Problem3: React.FC = () => {
    // State
    const [mass, setMass] = useState(10); // kg
    const [force, setForce] = useState(0); // N
    const [angle, setAngle] = useState(0); // degrees
    const [muStatic, setMuStatic] = useState(0.5);
    const [muKinetic, setMuKinetic] = useState(0.3);

    // Simulation State
    const [isPlaying, setIsPlaying] = useState(false);
    const [time, setTime] = useState(0);
    const [timeScale, setTimeScale] = useState(1.0);
    const [results, setResults] = useState({
        normal: 0,
        friction: 0,
        acceleration: 0,
        netForceX: 0
    });

    // Challenge State
    const [isChallengeMode, setIsChallengeMode] = useState(false);
    const [challenge, setChallenge] = useState<{ type: string; targetValue: number; question: string } | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

    const generateChallenge = () => {
        // Randomize parameters
        const newMass = Math.floor(Math.random() * 50) + 10;
        const newForce = Math.floor(Math.random() * 200) + 50;
        const newAngle = Math.floor(Math.random() * 60); // 0 to 60 degrees
        const newMuK = Number((Math.random() * 0.5 + 0.1).toFixed(2));
        const newMuS = Number((newMuK + 0.2).toFixed(2));

        setMass(newMass);
        setForce(newForce);
        setAngle(newAngle);
        setMuKinetic(newMuK);
        setMuStatic(newMuS);

        // Calculate expected values
        const res = calculateDynamics(newMass, newForce, newAngle, newMuS, newMuK);

        const types = [
            { type: 'normal', val: res.normal, q: 'Calcula la Fuerza Normal (N)' },
            { type: 'friction', val: Math.abs(res.friction), q: 'Calcula la Fuerza de Fricción (N)' },
            { type: 'acceleration', val: res.acceleration, q: 'Calcula la Aceleración (m/s²)' }
        ];

        const selected = types[Math.floor(Math.random() * types.length)];
        setChallenge({ type: selected.type, targetValue: selected.val, question: selected.q });
        setUserAnswer('');
        setFeedback(null);
        setIsPlaying(false);
        setTime(0);
    };

    const checkChallengeAnswer = () => {
        if (!challenge) return;
        const val = parseFloat(userAnswer);
        if (isNaN(val)) return;

        // Tolerance 5%
        const diff = Math.abs(val - challenge.targetValue);
        const tolerance = Math.max(0.1, challenge.targetValue * 0.05);

        if (diff <= tolerance) {
            setFeedback({ isCorrect: true, message: '¡Correcto! Bien hecho.' });
        } else {
            setFeedback({ isCorrect: false, message: `Incorrecto. El valor era ${challenge.targetValue.toFixed(2)}` });
        }
    };

    // Physics Loop
    useEffect(() => {
        const result = calculateDynamics(mass, force, angle, muStatic, muKinetic);

        setResults({
            normal: result.normal,
            friction: result.friction,
            acceleration: result.acceleration,
            netForceX: result.netForceX
        });
    }, [mass, force, angle, muStatic, muKinetic]);

    // Animation Loop
    useEffect(() => {
        if (!isPlaying) return;

        let animationFrameId: number;
        let previousTime: number | undefined;

        const animate = (timestamp: number) => {
            if (previousTime === undefined) previousTime = timestamp;
            const deltaTime = (timestamp - previousTime) / 1000;
            previousTime = timestamp;

            // Only update time if there is acceleration (it moves)
            if (results.acceleration > 0) {
                // Apply time scale
                setTime(prev => prev + deltaTime * timeScale);
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isPlaying, results.acceleration]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-heading text-secondary">Desafío de Fuerzas: Dinámica</h1>
                <Link to="/" className="text-gray-400 hover:text-white text-sm md:text-base">← Volver al Dashboard</Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Simulation Area */}
                <div className="lg:col-span-2 space-y-4">
                    <ForceCanvas
                        mass={mass}
                        force={force}
                        angle={angle}
                        frictionCoeff={muKinetic} // Visualizing kinetic for now
                        isMoving={isPlaying && results.acceleration > 0}
                        acceleration={results.acceleration}
                        time={time}
                        normalForce={results.normal}
                        frictionForce={results.friction}
                    />

                    <div className="flex gap-4 bg-gray-800/50 p-4 rounded-lg">
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="px-6 py-2 bg-secondary text-black font-bold rounded hover:bg-secondary/80 transition"
                        >
                            {isPlaying ? '⏸ Pausa' : '▶ Simular'}
                        </button>
                        <button
                            onClick={() => { setIsPlaying(false); setTime(0); }}
                            className="px-6 py-2 bg-gray-700 text-white font-bold rounded hover:bg-gray-600 transition"
                        >
                            ⏮ Reiniciar
                        </button>

                        <div className="ml-auto flex gap-4 text-sm font-mono text-gray-300">
                            <div>a: {results.acceleration.toFixed(2)} m/s²</div>
                            <div>t: {time.toFixed(2)} s</div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs">Vel:</span>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="5.0"
                                    step="0.1"
                                    value={timeScale}
                                    onChange={(e) => setTimeScale(Number(e.target.value))}
                                    className="w-20 accent-green-500"
                                />
                                <span className="text-xs">{timeScale.toFixed(1)}x</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls Area */}
                <div className="space-y-6 bg-gray-800/30 p-6 rounded-lg border border-gray-700 h-fit">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-accent">Configuración</h2>
                        <button
                            onClick={() => {
                                setIsChallengeMode(!isChallengeMode);
                                if (!isChallengeMode) generateChallenge();
                                else setChallenge(null);
                            }}
                            className={`px-3 py-1 text-sm rounded ${isChallengeMode ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-600 hover:bg-purple-700'} text-white transition`}
                        >
                            {isChallengeMode ? 'Salir del Reto' : 'Modo Reto'}
                        </button>
                    </div>

                    {isChallengeMode && challenge ? (
                        <div className="bg-purple-900/30 p-4 rounded border border-purple-500/50 space-y-4">
                            <h3 className="font-bold text-purple-300">🎯 Reto Activo</h3>
                            <p className="text-white">{challenge.question}</p>

                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    placeholder="Tu respuesta..."
                                    className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"
                                />
                                <button
                                    onClick={checkChallengeAnswer}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-bold"
                                >
                                    Verificar
                                </button>
                            </div>

                            {feedback && (
                                <div className={`p-3 rounded ${feedback.isCorrect ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                                    {feedback.message}
                                    {feedback.isCorrect && (
                                        <button
                                            onClick={generateChallenge}
                                            className="block mt-2 text-sm underline hover:text-white"
                                        >
                                            Siguiente Reto →
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : null}

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <span className="text-sm text-gray-400">Masa (kg)</span>
                            <div className="flex items-center gap-3">
                                <input
                                    type="range" min="1" max="100"
                                    value={mass}
                                    onChange={(e) => setMass(Number(e.target.value))}
                                    className="flex-1 accent-secondary"
                                />
                                <span className="font-mono font-bold text-secondary text-lg w-16 text-right">{mass} kg</span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className="text-sm text-gray-400">Fuerza Aplicada (N)</span>
                            <div className="flex items-center gap-3">
                                <input
                                    type="range" min="0" max="500"
                                    value={force}
                                    onChange={(e) => setForce(Number(e.target.value))}
                                    className="flex-1 accent-orange-500"
                                />
                                <span className="font-mono font-bold text-orange-500 text-lg w-16 text-right">{force} N</span>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className="text-sm text-gray-400">Ángulo (°)</span>
                            <div className="flex items-center gap-3">
                                <input
                                    type="range" min="-90" max="90"
                                    value={angle}
                                    onChange={(e) => setAngle(Number(e.target.value))}
                                    className="flex-1 accent-blue-500"
                                />
                                <span className="font-mono font-bold text-blue-500 text-lg w-16 text-right">{angle}°</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <label className="block">
                            <span className="text-sm text-gray-400">μ Estático</span>
                            <input
                                type="number" step="0.1" min="0" max="1"
                                value={muStatic}
                                onChange={(e) => setMuStatic(Number(e.target.value))}
                                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1"
                            />
                        </label>
                        <label className="block">
                            <span className="text-sm text-gray-400">μ Cinético</span>
                            <input
                                type="number" step="0.1" min="0" max="1"
                                value={muKinetic}
                                onChange={(e) => setMuKinetic(Number(e.target.value))}
                                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1"
                            />
                        </label>
                    </div>
                </div>

                {!isChallengeMode && (
                    <div className="border-t border-gray-700 pt-4 space-y-2">
                        <h3 className="font-bold text-gray-300">Resultados (DCL)</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                            <div className="text-red-400">Peso (mg): {(mass * 9.8).toFixed(1)} N</div>
                            <div className="text-green-400">Normal (N): {results.normal.toFixed(1)} N</div>
                            <div className="text-purple-400">Fricción: {Math.abs(results.friction).toFixed(1)} N</div>
                            <div className="text-white">Fuerza Neta X: {results.netForceX.toFixed(1)} N</div>
                            <div className={`${results.acceleration > 0 ? 'text-green-400' : 'text-yellow-400'} col-span-2 text-center font-bold`}>
                                Estado: {results.acceleration > 0 ? 'EN MOVIMIENTO 🚀' : 'ESTÁTICO 🛑'}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
};

export default Problem3;
