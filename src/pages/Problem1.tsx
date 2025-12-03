import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import VectorCanvas from '../components/physics/VectorCanvas';
import { calculateVectorComponents, calculateResultant } from '../utils/physics-calculations';

const Problem1: React.FC = () => {
    const [vectorA, setVectorA] = useState({ magnitude: 10, angle: 0 });
    const [vectorB, setVectorB] = useState({ magnitude: 10, angle: 90 });
    const [showResultant, setShowResultant] = useState(false);

    const compA = calculateVectorComponents(vectorA.magnitude, vectorA.angle);
    const compB = calculateVectorComponents(vectorB.magnitude, vectorB.angle);
    const resultant = calculateResultant(vectorA.magnitude, vectorA.angle, vectorB.magnitude, vectorB.angle);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-heading text-secondary">Laboratorio Espacial: Vectores</h1>
                <Link to="/" className="text-gray-400 hover:text-white">← Volver al Dashboard</Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visualization */}
                <div>
                    <VectorCanvas
                        vectorA={{ ...vectorA, color: '#3B82F6', label: 'A' }}
                        vectorB={{ ...vectorB, color: '#EF4444', label: 'B' }}
                        showResultant={showResultant}
                    />
                </div>

                {/* Controls */}
                <div className="space-y-8">
                    {/* Vector A Controls */}
                    <div className="bg-gray-800/50 p-6 rounded-lg border border-blue-500/30">
                        <h3 className="text-xl font-bold text-blue-400 mb-4">Vector A</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-sm text-gray-400">Magnitud</span>
                                <input
                                    type="number"
                                    value={vectorA.magnitude}
                                    onChange={(e) => setVectorA({ ...vectorA, magnitude: Number(e.target.value) })}
                                    className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                                />
                            </label>
                            <label className="block">
                                <span className="text-sm text-gray-400">Ángulo (°)</span>
                                <input
                                    type="number"
                                    value={vectorA.angle}
                                    onChange={(e) => setVectorA({ ...vectorA, angle: Number(e.target.value) })}
                                    className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                                />
                            </label>
                        </div>
                        <div className="mt-2 text-sm text-gray-500 font-mono">
                            Ax: {compA.x.toFixed(2)}, Ay: {compA.y.toFixed(2)}
                        </div>
                    </div>

                    {/* Vector B Controls */}
                    <div className="bg-gray-800/50 p-6 rounded-lg border border-red-500/30">
                        <h3 className="text-xl font-bold text-red-400 mb-4">Vector B</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="block">
                                <span className="text-sm text-gray-400">Magnitud</span>
                                <input
                                    type="number"
                                    value={vectorB.magnitude}
                                    onChange={(e) => setVectorB({ ...vectorB, magnitude: Number(e.target.value) })}
                                    className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                                />
                            </label>
                            <label className="block">
                                <span className="text-sm text-gray-400">Ángulo (°)</span>
                                <input
                                    type="number"
                                    value={vectorB.angle}
                                    onChange={(e) => setVectorB({ ...vectorB, angle: Number(e.target.value) })}
                                    className="mt-1 block w-full bg-gray-900 border border-gray-700 rounded px-3 py-2"
                                />
                            </label>
                        </div>
                        <div className="mt-2 text-sm text-gray-500 font-mono">
                            Bx: {compB.x.toFixed(2)}, By: {compB.y.toFixed(2)}
                        </div>
                    </div>

                    {/* Resultant Controls */}
                    <div className="bg-gray-800/50 p-6 rounded-lg border border-green-500/30">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-green-400">Resultante (R = A + B)</h3>
                            <button
                                onClick={() => setShowResultant(!showResultant)}
                                className={`px-4 py-2 rounded font-bold transition ${showResultant ? 'bg-green-500 text-black' : 'bg-gray-700 text-gray-300'}`}
                            >
                                {showResultant ? 'Ocultar' : 'Mostrar'}
                            </button>
                        </div>

                        {showResultant && (
                            <div className="space-y-2 font-mono text-green-300">
                                <div className="flex justify-between border-b border-gray-700 pb-2">
                                    <span>Rx: {resultant.x.toFixed(2)}</span>
                                    <span>Ry: {resultant.y.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between pt-2">
                                    <span>Magnitud: {resultant.magnitude.toFixed(2)}</span>
                                    <span>Ángulo: {resultant.angle.toFixed(2)}°</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Problem1;
