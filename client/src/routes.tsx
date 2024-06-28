import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import { StockMonitor, StoreInventory, StoreList, ChartsContainer } from './pages'

const Routes: React.FC = () => (
  <RouterRoutes>
    <Route path="/" element={<StoreList />} />
    <Route path="/store/:guid" element={<StoreInventory />} />
    <Route path="/admin" element={<StockMonitor />} />
    <Route path="/report" element={<ChartsContainer />} />
  </RouterRoutes>
);

export default Routes;
