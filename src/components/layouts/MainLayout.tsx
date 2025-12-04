import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-background text-text transition-colors duration-300">
            <main className="container mx-auto px-4 py-4 md:py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
