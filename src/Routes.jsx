import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import GridLoadRenewableEnergyCorrelationAnalysis from './pages/grid-load-renewable-energy-correlation-analysis';
import RealTimeEnergyOptimizationDashboard from './pages/real-time-energy-optimization-dashboard';
import CostSavingsEnvironmentalImpactAnalytics from './pages/cost-savings-environmental-impact-analytics';
import FleetChargingOperationsMonitor from './pages/fleet-charging-operations-monitor';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<CostSavingsEnvironmentalImpactAnalytics />} />
        <Route path="/grid-load-renewable-energy-correlation-analysis" element={<GridLoadRenewableEnergyCorrelationAnalysis />} />
        <Route path="/real-time-energy-optimization-dashboard" element={<RealTimeEnergyOptimizationDashboard />} />
        <Route path="/cost-savings-environmental-impact-analytics" element={<CostSavingsEnvironmentalImpactAnalytics />} />
        <Route path="/fleet-charging-operations-monitor" element={<FleetChargingOperationsMonitor />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;

