import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import KPIMetricCard from './components/KPIMetricCard';
import RenewableGridChart from './components/RenewableGridChart';
import ChargingRecommendations from './components/ChargingRecommendations';
import ActiveChargingSessions from './components/ActiveChargingSessions';
import GlobalControls from './components/GlobalControls';

const RealTimeEnergyOptimizationDashboard = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(15);
  const [kpiData, setKpiData] = useState({
    renewableAvailability: 0,
    gridLoad: 0,
    activeSessions: 0,
    costSavings: 0
  });

  const generateKPIData = () => {
    // Simulate real-time KPI data updates
    const now = new Date();
    const hour = now?.getHours();
    
    // Renewable availability varies by time of day
    const solarFactor = hour >= 6 && hour <= 18 ? 
      Math.sin((hour - 6) * Math.PI / 12) : 0;
    const windFactor = 0.3 + Math.sin(hour * Math.PI / 12) * 0.2;
    
    const renewableAvailability = Math.max(0, Math.min(100, 
      (solarFactor * 60 + windFactor * 40) + (Math.random() - 0.5) * 20
    ));

    // Grid load patterns
    const peakHours = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 21);
    const gridLoad = peakHours ? 
      75 + Math.random() * 20 : 
      45 + Math.random() * 25;

    // Active sessions vary throughout the day
    const activeSessions = Math.floor(12 + Math.random() * 8);
    
    // Cost savings based on renewable availability
    const costSavings = (renewableAvailability / 100) * 450 + Math.random() * 100;

    setKpiData({
      renewableAvailability: Math.round(renewableAvailability),
      gridLoad: Math.round(gridLoad),
      activeSessions,
      costSavings: Math.round(costSavings)
    });
  };

  useEffect(() => {
    generateKPIData();
    
    let interval;
    if (autoRefresh) {
      interval = setInterval(generateKPIData, refreshInterval * 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval]);

  const handleTimeRangeChange = (newTimeRange) => {
    setTimeRange(newTimeRange);
  };

  const handleLocationChange = (newLocation) => {
    setSelectedLocation(newLocation);
  };

  const handleAutoRefreshToggle = (enabled, interval) => {
    setAutoRefresh(enabled);
    setRefreshInterval(interval);
  };

  const getTrendDirection = (value, threshold) => {
    if (value > threshold) return 'up';
    if (value < threshold * 0.8) return 'down';
    return 'stable';
  };

  return (
    <>
      <Helmet>
        <title>Real-Time Energy Optimization Dashboard - EV Smart Charging</title>
        <meta name="description" content="Monitor renewable energy availability, grid conditions, and optimize EV charging schedules in real-time for maximum cost savings and environmental impact." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Real-Time Energy Optimization Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                Monitor renewable energy availability and optimize charging schedules for maximum efficiency and cost savings
              </p>
            </div>

            {/* Global Controls */}
            <GlobalControls
              onTimeRangeChange={handleTimeRangeChange}
              onLocationChange={handleLocationChange}
              onAutoRefreshToggle={handleAutoRefreshToggle}
            />

            {/* KPI Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              <KPIMetricCard
                title="Renewable Availability"
                value={kpiData?.renewableAvailability}
                unit="%"
                trend={getTrendDirection(kpiData?.renewableAvailability, 70)}
                trendValue={`${Math.round(Math.random() * 10 + 2)}%`}
                icon="Sun"
                color="renewable"
                description="Current renewable energy generation"
                status={kpiData?.renewableAvailability > 80 ? 'optimal' : kpiData?.renewableAvailability > 50 ? 'normal' : 'warning'}
              />

              <KPIMetricCard
                title="Grid Load Status"
                value={kpiData?.gridLoad}
                unit="%"
                trend={getTrendDirection(kpiData?.gridLoad, 60)}
                trendValue={`${Math.round(Math.random() * 8 + 1)}%`}
                icon="Zap"
                color="grid"
                description="Current grid demand level"
                status={kpiData?.gridLoad < 60 ? 'optimal' : kpiData?.gridLoad < 80 ? 'normal' : 'warning'}
              />

              <KPIMetricCard
                title="Active Sessions"
                value={kpiData?.activeSessions}
                unit="vehicles"
                trend="up"
                trendValue="3"
                icon="Car"
                color="primary"
                description="Currently charging vehicles"
                status="normal"
              />

              <KPIMetricCard
                title="Cost Savings Today"
                value={`${kpiData?.costSavings}`}
                unit="$"
                trend={getTrendDirection(kpiData?.costSavings, 400)}
                trendValue={`${Math.round(Math.random() * 50 + 10)}`}
                icon="DollarSign"
                color="cost"
                description="Savings vs standard rates"
                status={kpiData?.costSavings > 400 ? 'optimal' : 'normal'}
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
              {/* Main Chart - Takes 2/3 width on xl screens */}
              <div className="xl:col-span-2">
                <RenewableGridChart timeRange={timeRange} />
              </div>

              {/* Charging Recommendations Sidebar */}
              <div className="xl:col-span-1">
                <ChargingRecommendations />
              </div>
            </div>

            {/* Active Charging Sessions */}
            <ActiveChargingSessions />

            {/* Quick Actions Footer */}
            <div className="mt-8 p-6 bg-muted rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-1">
                    Quick Actions
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Common optimization tasks and emergency controls
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors duration-200">
                    Optimize All Schedules
                  </button>
                  <button className="px-4 py-2 bg-renewable text-white rounded-lg text-sm font-medium hover:bg-renewable/90 transition-colors duration-200">
                    Maximize Renewable Usage
                  </button>
                  <button className="px-4 py-2 bg-warning text-warning-foreground rounded-lg text-sm font-medium hover:bg-warning/90 transition-colors duration-200">
                    Emergency Stop All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default RealTimeEnergyOptimizationDashboard;