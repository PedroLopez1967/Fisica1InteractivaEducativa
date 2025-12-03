import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center space-y-8">
            <h1 className="text-4xl font-heading text-primary">Física General I</h1>
            <p className="text-xl text-text">Selecciona un escenario para comenzar:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                <Link to="/problem/1" className="p-6 border border-secondary/30 rounded-lg hover:bg-white/5 transition group">
                    <h2 className="text-2xl font-bold text-secondary group-hover:text-accent transition-colors">Laboratorio Espacial</h2>
                    <p className="mt-2 text-gray-300">Cinemática Vectorial</p>
                </Link>
                <Link to="/problem/2" className="p-6 border border-secondary/30 rounded-lg hover:bg-white/5 transition group">
                    <h2 className="text-2xl font-bold text-secondary group-hover:text-accent transition-colors">Base Lunar</h2>
                    <p className="mt-2 text-gray-300">Movimiento Parabólico</p>
                </Link>
                <Link to="/problem/3" className="p-6 border border-secondary/30 rounded-lg hover:bg-white/5 transition group">
                    <h2 className="text-2xl font-bold text-secondary group-hover:text-accent transition-colors">Desafío de Fuerzas</h2>
                    <p className="mt-2 text-gray-300">Dinámica y Fricción</p>
                </Link>
                <Link to="/problem/4" className="p-6 border border-secondary/30 rounded-lg hover:bg-white/5 transition group">
                    <h2 className="text-2xl font-bold text-secondary group-hover:text-accent transition-colors">Torre de Energía</h2>
                    <p className="mt-2 text-gray-300">Conservación de Energía</p>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
