import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Problem2 from './pages/Problem2';
import Problem1 from './pages/Problem1';
import Problem3 from './pages/Problem3';
import Problem4 from './pages/Problem4';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="problem/1" element={<Problem1 />} />
          <Route path="problem/2" element={<Problem2 />} />
          <Route path="problem/3" element={<Problem3 />} />
          <Route path="problem/4" element={<Problem4 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
