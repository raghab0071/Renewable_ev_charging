import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import FilterPanel from './components/FilterPanel';
import CorrelationHeatmap from './components/CorrelationHeatmap';
import StatisticalSummary from './components/StatisticalSummary';
import TimelineCharts from './components/TimelineCharts';
import AdvancedControls from './components/AdvancedControls';
import DataTable from './components/DataTable';

const GridLoadRenewableEnergyCorrelationAnalysis = () => {
  const [filters, setFilters] = useState({
    weather: 'all',
    renewableSource: 'all',
    region: 'all',
    season: 'all',
    includeWeekends: true,
    includePeakHours: true,
    showConfidenceIntervals: true
  });

  const [savedFilters, setSavedFilters] = useState([
    {
      name: 'High Solar Days',
      filters: {
        weather: 'sunny',
        renewableSource: 'solar',
        region: 'all',
        season: 'summer',
        includeWeekends: true,
        includePeakHours: true,
        showConfidenceIntervals: true
      }
    },
    {
      name: 'Peak Demand Analysis',
      filters: {
        weather: 'all',
        renewableSource: 'all',
        region: 'all',
        season: 'all',
        includeWeekends: false,
        includePeakHours: true,
        showConfidenceIntervals: true
      }
    }
  ]);

  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Auto-refresh data every 15 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(interval);
  }, []);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Reset selected time range when filters change
    setSelectedTimeRange(null);
  };

  const handleSaveFilter = (name, filterSet) => {
    setSavedFilters(prev => [...prev, { name, filters: filterSet }]);
  };

  const handleLoadFilter = (filterSet) => {
    setFilters(filterSet);
  };

  const handleTimeRangeSelect = (timeRange) => {
    setSelectedTimeRange(timeRange);
  };

  const handleScenarioChange = (scenario) => {
    console.log('Scenario changed:', scenario);
    // In a real app, this would trigger scenario-based data updates
  };

  const handleForecastHorizonChange = (horizon) => {
    console.log('Forecast horizon changed:', horizon);
    // In a real app, this would update the forecast range
  };

  const handleComparisonChange = (sources) => {
    console.log('Comparison sources changed:', sources);
    // In a real app, this would update the comparison analysis
  };

  return (
    <>
      <Helmet>
        <title>Grid Load & Renewable Energy Correlation Analysis - EV Smart Charging Dashboard</title>
        <meta name="description" content="Advanced analytical dashboard for exploring complex relationships between renewable generation patterns, grid stability, and optimal EV charging windows." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16">
          <div className="max-w-[1920px] mx-auto p-6">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-text-primary mb-2">
                    Grid Load & Renewable Energy Correlation Analysis
                  </h1>
                  <p className="text-text-secondary">
                    Advanced analytical dashboard for energy analysts and utility partners to explore complex relationships between renewable generation patterns and grid stability.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-text-secondary">Last Updated</div>
                  <div className="text-sm font-mono text-text-primary">
                    {lastUpdated?.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Grid Layout - 16 columns */}
            <div className="grid grid-cols-1 xl:grid-cols-16 gap-6">
              {/* Left Sidebar - Filters (4 cols on desktop) */}
              <div className="xl:col-span-4 space-y-6">
                <FilterPanel
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onSaveFilter={handleSaveFilter}
                  savedFilters={savedFilters}
                  onLoadFilter={handleLoadFilter}
                />
                
                <StatisticalSummary
                  filters={filters}
                  selectedTimeRange={selectedTimeRange}
                />
              </div>

              {/* Main Content Area (12 cols on desktop) */}
              <div className="xl:col-span-12 space-y-6">
                {/* Primary Visualization - Correlation Heatmap */}
                <CorrelationHeatmap
                  filters={filters}
                  selectedTimeRange={selectedTimeRange}
                  onTimeRangeSelect={handleTimeRangeSelect}
                />

                {/* Timeline Charts */}
                <TimelineCharts
                  filters={filters}
                  selectedTimeRange={selectedTimeRange}
                />

                {/* Advanced Controls */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <AdvancedControls
                      onScenarioChange={handleScenarioChange}
                      onForecastHorizonChange={handleForecastHorizonChange}
                      onComparisonChange={handleComparisonChange}
                    />
                  </div>
                  
                  {/* Data Table spans remaining columns */}
                  <div className="lg:col-span-2">
                    <DataTable
                      filters={filters}
                      selectedTimeRange={selectedTimeRange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile-specific stacked layout */}
            <div className="xl:hidden mt-8">
              <div className="space-y-6">
                {/* Mobile view shows simplified correlation view */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">
                    Mobile Correlation Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-success/10 rounded-lg">
                      <div className="text-2xl font-bold text-success">72.3%</div>
                      <div className="text-sm text-text-secondary">Avg Correlation</div>
                    </div>
                    <div className="text-center p-4 bg-secondary/10 rounded-lg">
                      <div className="text-2xl font-bold text-secondary">14</div>
                      <div className="text-sm text-text-secondary">Optimal Windows</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default GridLoadRenewableEnergyCorrelationAnalysis;