import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import KPIMetricCard from './components/KPIMetricCard';
import CostComparisonChart from './components/CostComparisonChart';
import EnvironmentalImpactPanel from './components/EnvironmentalImpactPanel';
import RenewableCorrelationChart from './components/RenewableCorrelationChart';
import FilterControls from './components/FilterControls';

const CostSavingsEnvironmentalImpactAnalytics = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('thisMonth');
  const [comparisonMode, setComparisonMode] = useState('monthOverMonth');
  const [selectedSegment, setSelectedSegment] = useState('all');

  // Mock KPI data
  const kpiData = [
    {
      title: "Total Cost Savings",
      value: "284,750",
      unit: "USD",
      change: 18.5,
      changeType: "positive",
      icon: "DollarSign",
      color: "primary",
      description: "vs conventional charging"
    },
    {
      title: "CO₂ Reduction",
      value: "1,247",
      unit: "tons",
      change: 23.2,
      changeType: "positive",
      icon: "Leaf",
      color: "success",
      description: "carbon footprint avoided"
    },
    {
      title: "Renewable Energy Usage",
      value: "78.5",
      unit: "%",
      change: 12.8,
      changeType: "positive",
      icon: "Sun",
      color: "warning",
      description: "of total energy consumed"
    },
    {
      title: "Grid Stress Avoidance",
      value: "92.3",
      unit: "%",
      change: 8.7,
      changeType: "positive",
      icon: "Zap",
      color: "secondary",
      description: "peak demand reduction"
    }
  ];

  // Mock cost comparison data
  const costComparisonData = [
    {
      period: "Jan 2025",
      smartCharging: 45200,
      conventional: 58900,
      renewablePercentage: 72
    },
    {
      period: "Feb 2025",
      smartCharging: 42800,
      conventional: 56200,
      renewablePercentage: 68
    },
    {
      period: "Mar 2025",
      smartCharging: 48600,
      conventional: 62400,
      renewablePercentage: 75
    },
    {
      period: "Apr 2025",
      smartCharging: 44900,
      conventional: 59800,
      renewablePercentage: 71
    },
    {
      period: "May 2025",
      smartCharging: 41200,
      conventional: 55600,
      renewablePercentage: 79
    },
    {
      period: "Jun 2025",
      smartCharging: 43800,
      conventional: 58200,
      renewablePercentage: 76
    },
    {
      period: "Jul 2025",
      smartCharging: 46500,
      conventional: 61800,
      renewablePercentage: 73
    },
    {
      period: "Aug 2025",
      smartCharging: 44100,
      conventional: 58900,
      renewablePercentage: 77
    },
    {
      period: "Sep 2025",
      smartCharging: 42900,
      conventional: 57400,
      renewablePercentage: 81
    }
  ];

  // Mock environmental impact data
  const environmentalData = {
    co2Avoided: 1247,
    cleanEnergyUsed: 2856,
    equivalentTrees: 15680,
    co2ReductionProgress: 1247,
    co2ReductionTarget: 1500,
    renewableUsageProgress: 2856,
    renewableUsageTarget: 3200,
    gridStressReductionProgress: 923,
    gridStressReductionTarget: 1000
  };

  // Mock renewable correlation data
  const renewableCorrelationData = [
    {
      time: "00:00",
      renewableAvailability: 15,
      chargingEfficiency: 45,
      correlationStrength: 0.3,
      confidenceUpper: 20,
      confidenceLower: 10
    },
    {
      time: "04:00",
      renewableAvailability: 12,
      chargingEfficiency: 42,
      correlationStrength: 0.25,
      confidenceUpper: 18,
      confidenceLower: 8
    },
    {
      time: "08:00",
      renewableAvailability: 45,
      chargingEfficiency: 68,
      correlationStrength: 0.72,
      confidenceUpper: 52,
      confidenceLower: 38
    },
    {
      time: "12:00",
      renewableAvailability: 85,
      chargingEfficiency: 92,
      correlationStrength: 0.89,
      confidenceUpper: 92,
      confidenceLower: 78
    },
    {
      time: "16:00",
      renewableAvailability: 78,
      chargingEfficiency: 88,
      correlationStrength: 0.85,
      confidenceUpper: 85,
      confidenceLower: 71
    },
    {
      time: "20:00",
      renewableAvailability: 35,
      chargingEfficiency: 58,
      correlationStrength: 0.65,
      confidenceUpper: 42,
      confidenceLower: 28
    }
  ];

  const handleDateRangeChange = (range) => {
    setSelectedDateRange(range);
    console.log('Date range changed to:', range);
  };

  const handleComparisonModeChange = (mode) => {
    setComparisonMode(mode);
    console.log('Comparison mode changed to:', mode);
  };

  const handleSegmentationChange = (segment) => {
    setSelectedSegment(segment);
    console.log('Segmentation changed to:', segment);
  };

  const handleExport = (format) => {
    console.log(`Exporting data in ${format} format`);
    // Mock export functionality
    const exportData = {
      kpis: kpiData,
      costComparison: costComparisonData,
      environmental: environmentalData,
      correlation: renewableCorrelationData
    };
    
    // Simulate download
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cost-savings-environmental-analytics-${selectedDateRange}.${format}`;
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleBookmark = () => {
    const bookmarkData = {
      dateRange: selectedDateRange,
      comparisonMode: comparisonMode,
      segmentation: selectedSegment,
      timestamp: new Date()?.toISOString()
    };
    
    // Save to localStorage
    const existingBookmarks = JSON.parse(localStorage.getItem('analyticsBookmarks') || '[]');
    existingBookmarks?.push(bookmarkData);
    localStorage.setItem('analyticsBookmarks', JSON.stringify(existingBookmarks));
    
    console.log('View bookmarked:', bookmarkData);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Cost Savings & Environmental Impact Analytics
            </h1>
            <p className="text-text-secondary">
              Executive-focused dashboard quantifying financial and environmental benefits of smart charging strategies
            </p>
          </div>

          {/* Filter Controls */}
          <FilterControls
            onDateRangeChange={handleDateRangeChange}
            onComparisonModeChange={handleComparisonModeChange}
            onSegmentationChange={handleSegmentationChange}
            onExport={handleExport}
            onBookmark={handleBookmark}
          />

          {/* KPI Metrics Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {kpiData?.map((kpi, index) => (
              <KPIMetricCard
                key={index}
                title={kpi?.title}
                value={kpi?.value}
                unit={kpi?.unit}
                change={kpi?.change}
                changeType={kpi?.changeType}
                icon={kpi?.icon}
                color={kpi?.color}
                description={kpi?.description}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-8">
            {/* Cost Comparison Chart - 8 columns */}
            <div className="xl:col-span-8">
              <CostComparisonChart 
                data={costComparisonData}
                timeRange={selectedDateRange}
              />
            </div>

            {/* Environmental Impact Panel - 4 columns */}
            <div className="xl:col-span-4">
              <EnvironmentalImpactPanel data={environmentalData} />
            </div>
          </div>

          {/* Renewable Correlation Chart - Full Width */}
          <div className="mb-8">
            <RenewableCorrelationChart 
              data={renewableCorrelationData}
              showConfidenceInterval={true}
            />
          </div>

          {/* Additional Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cost Savings Breakdown */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Cost Savings Breakdown</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Peak Demand Avoidance</span>
                  <span className="text-sm font-medium text-text-primary">$156,420</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Time-of-Use Optimization</span>
                  <span className="text-sm font-medium text-text-primary">$89,230</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Renewable Energy Credits</span>
                  <span className="text-sm font-medium text-text-primary">$39,100</span>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">Total Savings</span>
                    <span className="text-lg font-bold text-success">$284,750</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Environmental Metrics */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Environmental Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Carbon Intensity Reduction</span>
                  <span className="text-sm font-medium text-success">-34.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Water Usage Savings</span>
                  <span className="text-sm font-medium text-primary">2.8M gallons</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Air Quality Improvement</span>
                  <span className="text-sm font-medium text-secondary">+12.5%</span>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">ESG Score Impact</span>
                    <span className="text-lg font-bold text-success">+18 points</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Optimization Recommendations */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Optimization Opportunities</h3>
              <div className="space-y-3">
                <div className="p-3 bg-success/10 border-l-4 border-success rounded-md">
                  <p className="text-sm font-medium text-text-primary">Increase Solar Utilization</p>
                  <p className="text-xs text-text-secondary">Potential +$45K annual savings</p>
                </div>
                <div className="p-3 bg-primary/10 border-l-4 border-primary rounded-md">
                  <p className="text-sm font-medium text-text-primary">Expand Off-Peak Charging</p>
                  <p className="text-xs text-text-secondary">Potential +$28K annual savings</p>
                </div>
                <div className="p-3 bg-warning/10 border-l-4 border-warning rounded-md">
                  <p className="text-sm font-medium text-text-primary">Battery Storage Integration</p>
                  <p className="text-xs text-text-secondary">Potential +$67K annual savings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CostSavingsEnvironmentalImpactAnalytics;