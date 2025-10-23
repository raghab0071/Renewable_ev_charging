import React from 'react';
import Icon from '../../../components/AppIcon';

const StatisticalSummary = ({ filters, selectedTimeRange }) => {
  // Mock statistical data based on filters
  const getStatisticalData = () => {
    const baseCorrelation = 0.72;
    const basePredictionAccuracy = 0.85;
    const baseUtilizationRate = 0.68;
    
    // Adjust based on filters
    let correlationAdjustment = 0;
    let accuracyAdjustment = 0;
    let utilizationAdjustment = 0;
    
    if (filters?.weather === 'sunny') {
      correlationAdjustment += 0.08;
      utilizationAdjustment += 0.12;
    } else if (filters?.weather === 'windy') {
      correlationAdjustment += 0.05;
      utilizationAdjustment += 0.08;
    }
    
    if (filters?.renewableSource === 'solar') {
      accuracyAdjustment += 0.06;
    } else if (filters?.renewableSource === 'wind') {
      accuracyAdjustment += 0.04;
    }
    
    return {
      correlationCoefficient: Math.min(0.95, baseCorrelation + correlationAdjustment),
      predictionAccuracy: Math.min(0.98, basePredictionAccuracy + accuracyAdjustment),
      renewableUtilization: Math.min(0.92, baseUtilizationRate + utilizationAdjustment),
      optimalWindows: Math.floor(12 + Math.random() * 8),
      averageConfidence: 0.78 + Math.random() * 0.15,
      dataPoints: 8760, // Hours in a year
      lastUpdated: new Date()
    };
  };

  const stats = getStatisticalData();

  const StatCard = ({ title, value, subtitle, icon, trend, trendValue, color = 'text-primary' }) => (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${color?.replace('text-', 'bg-')}/10`}>
          <Icon name={icon} size={20} className={color} />
        </div>
        {trend && (
          <div className={`flex items-center text-xs ${
            trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-text-secondary'
          }`}>
            <Icon 
              name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
              size={14} 
              className="mr-1" 
            />
            {trendValue}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold text-text-primary">{value}</div>
        <div className="text-sm text-text-secondary">{title}</div>
        {subtitle && (
          <div className="text-xs text-text-secondary opacity-75">{subtitle}</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary flex items-center mb-6">
          <Icon name="BarChart3" size={20} className="mr-2" />
          Statistical Summary
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <StatCard
            title="Correlation Coefficient"
            value={stats?.correlationCoefficient?.toFixed(3)}
            subtitle="Renewable vs Grid Load"
            icon="TrendingUp"
            trend="up"
            trendValue="+0.05"
            color="text-primary"
          />

          <StatCard
            title="Prediction Accuracy"
            value={`${(stats?.predictionAccuracy * 100)?.toFixed(1)}%`}
            subtitle="24-hour forecast model"
            icon="Target"
            trend="up"
            trendValue="+2.3%"
            color="text-secondary"
          />

          <StatCard
            title="Renewable Utilization"
            value={`${(stats?.renewableUtilization * 100)?.toFixed(1)}%`}
            subtitle="Optimal charging windows"
            icon="Leaf"
            trend="up"
            trendValue="+4.7%"
            color="text-success"
          />

          <StatCard
            title="Optimal Windows"
            value={stats?.optimalWindows}
            subtitle="Per day average"
            icon="Clock"
            trend="stable"
            trendValue="±0.2"
            color="text-warning"
          />

          <StatCard
            title="Confidence Level"
            value={`${(stats?.averageConfidence * 100)?.toFixed(1)}%`}
            subtitle="Model reliability"
            icon="Shield"
            trend="up"
            trendValue="+1.8%"
            color="text-accent"
          />
        </div>
      </div>
      {/* Detailed Metrics */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-md font-semibold text-text-primary flex items-center mb-4">
          <Icon name="Info" size={18} className="mr-2" />
          Analysis Details
        </h4>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm text-text-secondary">Data Points Analyzed</span>
            <span className="text-sm font-medium text-text-primary">
              {stats?.dataPoints?.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm text-text-secondary">Time Period</span>
            <span className="text-sm font-medium text-text-primary">
              {filters?.season === 'all' ? 'Full Year' : filters?.season?.charAt(0)?.toUpperCase() + filters?.season?.slice(1)}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm text-text-secondary">Weather Filter</span>
            <span className="text-sm font-medium text-text-primary">
              {filters?.weather === 'all' ? 'All Conditions' : filters?.weather?.charAt(0)?.toUpperCase() + filters?.weather?.slice(1)}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm text-text-secondary">Renewable Source</span>
            <span className="text-sm font-medium text-text-primary">
              {filters?.renewableSource === 'all' ? 'All Sources' : filters?.renewableSource?.charAt(0)?.toUpperCase() + filters?.renewableSource?.slice(1)}
            </span>
          </div>

          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-text-secondary">Last Updated</span>
            <span className="text-sm font-medium text-text-primary font-mono">
              {stats?.lastUpdated?.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
      {/* Selected Range Analysis */}
      {selectedTimeRange && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <h4 className="text-md font-semibold text-text-primary flex items-center mb-4">
            <Icon name="Focus" size={18} className="mr-2" />
            Selected Range Analysis
          </h4>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Time Range</span>
              <span className="text-sm font-medium text-text-primary">
                {selectedTimeRange?.days ? 
                  `${selectedTimeRange?.days?.length} days` :
                  `${selectedTimeRange?.day}`
                } • {selectedTimeRange?.start}:00-{selectedTimeRange?.end}:00
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Correlation Score</span>
              <span className={`text-sm font-medium ${
                selectedTimeRange?.correlation >= 80 ? 'text-success' :
                selectedTimeRange?.correlation >= 60 ? 'text-secondary' :
                selectedTimeRange?.correlation >= 40 ? 'text-warning' : 'text-error'
              }`}>
                {selectedTimeRange?.correlation?.toFixed(1)}%
              </span>
            </div>

            {selectedTimeRange?.cellCount && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary">Data Points</span>
                <span className="text-sm font-medium text-text-primary">
                  {selectedTimeRange?.cellCount} hours
                </span>
              </div>
            )}

            <div className="mt-4 p-3 bg-card rounded-md">
              <p className="text-xs text-text-secondary">
                {selectedTimeRange?.correlation >= 80 ? 
                  "⚡ Excellent correlation - Highly recommended for EV charging optimization" :
                  selectedTimeRange?.correlation >= 60 ?
                  "✅ Good correlation - Suitable for scheduled charging" :
                  selectedTimeRange?.correlation >= 40 ?
                  "⚠️ Moderate correlation - Consider alternative time slots" : "❌ Poor correlation - Not recommended for optimal charging"
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticalSummary;