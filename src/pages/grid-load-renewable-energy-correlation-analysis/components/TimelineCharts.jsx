import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const TimelineCharts = ({ filters, selectedTimeRange }) => {
  const [chartData, setChartData] = useState([]);
  const [viewMode, setViewMode] = useState('24h');
  const [showConfidenceIntervals, setShowConfidenceIntervals] = useState(true);
  const [comparisonMode, setComparisonMode] = useState('historical');

  const viewModeOptions = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '1y', label: '1 Year' }
  ];

  const comparisonOptions = [
    { value: 'historical', label: 'Historical vs Predicted' },
    { value: 'sources', label: 'Solar vs Wind' },
    { value: 'regions', label: 'Regional Comparison' }
  ];

  // Generate mock timeline data
  useEffect(() => {
    const generateTimelineData = () => {
      const data = [];
      const dataPoints = viewMode === '24h' ? 24 : viewMode === '7d' ? 168 : viewMode === '30d' ? 720 : 8760;
      const interval = viewMode === '24h' ? 1 : viewMode === '7d' ? 1 : viewMode === '30d' ? 1 : 24;

      for (let i = 0; i < dataPoints; i += interval) {
        const baseTime = new Date();
        baseTime?.setHours(baseTime?.getHours() - (dataPoints - i));

        // Generate renewable energy data with seasonal and daily patterns
        const hourOfDay = baseTime?.getHours();
        const dayOfYear = Math.floor((baseTime - new Date(baseTime.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        
        // Solar pattern (peaks at noon, varies by season)
        const solarBase = Math.max(0, Math.sin((hourOfDay - 6) * Math.PI / 12)) * (0.8 + 0.2 * Math.sin(dayOfYear * 2 * Math.PI / 365));
        const solarNoise = (Math.random() - 0.5) * 0.3;
        const solarActual = Math.max(0, Math.min(100, (solarBase + solarNoise) * 100));
        const solarPredicted = Math.max(0, Math.min(100, solarBase * 100 + (Math.random() - 0.5) * 15));

        // Wind pattern (more variable, less predictable)
        const windBase = 0.3 + 0.4 * Math.random() + 0.2 * Math.sin(hourOfDay * Math.PI / 12);
        const windNoise = (Math.random() - 0.5) * 0.4;
        const windActual = Math.max(0, Math.min(100, (windBase + windNoise) * 100));
        const windPredicted = Math.max(0, Math.min(100, windBase * 100 + (Math.random() - 0.5) * 25));

        // Grid load pattern (peaks in evening, varies by day type)
        const isWeekend = baseTime?.getDay() === 0 || baseTime?.getDay() === 6;
        const gridLoadBase = isWeekend ? 
          0.4 + 0.3 * Math.sin((hourOfDay - 2) * Math.PI / 12) :
          0.5 + 0.4 * Math.sin((hourOfDay - 4) * Math.PI / 12);
        const gridLoadActual = Math.max(20, Math.min(100, gridLoadBase * 100 + (Math.random() - 0.5) * 20));
        const gridLoadPredicted = Math.max(20, Math.min(100, gridLoadBase * 100 + (Math.random() - 0.5) * 15));

        // Weather impact
        const weatherImpact = filters?.weather === 'sunny' ? 1.2 : 
                             filters?.weather === 'cloudy' ? 0.8 :
                             filters?.weather === 'windy' ? 1.1 : 1.0;

        // Confidence intervals
        const confidenceRange = 10 + Math.random() * 15;

        data?.push({
          time: baseTime?.toISOString(),
          timeLabel: viewMode === '24h' ? baseTime?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) :
            baseTime?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          solarActual: solarActual * weatherImpact,
          solarPredicted: solarPredicted * weatherImpact,
          solarConfidenceUpper: Math.min(100, solarPredicted * weatherImpact + confidenceRange),
          solarConfidenceLower: Math.max(0, solarPredicted * weatherImpact - confidenceRange),
          windActual,
          windPredicted,
          windConfidenceUpper: Math.min(100, windPredicted + confidenceRange),
          windConfidenceLower: Math.max(0, windPredicted - confidenceRange),
          gridLoadActual,
          gridLoadPredicted,
          gridLoadConfidenceUpper: Math.min(100, gridLoadPredicted + confidenceRange/2),
          gridLoadConfidenceLower: Math.max(0, gridLoadPredicted - confidenceRange/2),
          totalRenewableActual: (solarActual * weatherImpact + windActual) / 2,
          totalRenewablePredicted: (solarPredicted * weatherImpact + windPredicted) / 2,
          correlation: ((solarActual * weatherImpact + windActual) / 2 + (100 - gridLoadActual)) / 2,
          optimalCharging: ((solarActual * weatherImpact + windActual) / 2 + (100 - gridLoadActual)) / 2 > 60
        });
      }
      return data;
    };

    setChartData(generateTimelineData());
  }, [filters, viewMode]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-text-primary mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center justify-between text-xs mb-1">
              <span className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: entry?.color }}
                />
                {entry?.name}:
              </span>
              <span className="font-medium ml-2">
                {typeof entry?.value === 'number' ? entry?.value?.toFixed(1) : entry?.value}%
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (comparisonMode === 'historical') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="timeLabel" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-text-secondary)"
              fontSize={12}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Confidence intervals */}
            {showConfidenceIntervals && (
              <>
                <Area
                  dataKey="solarConfidenceUpper"
                  stackId="solarConfidence"
                  stroke="none"
                  fill="var(--color-secondary)"
                  fillOpacity={0.1}
                  name="Solar Confidence"
                />
                <Area
                  dataKey="solarConfidenceLower"
                  stackId="solarConfidence"
                  stroke="none"
                  fill="var(--color-background)"
                  fillOpacity={1}
                />
              </>
            )}
            
            <Line
              type="monotone"
              dataKey="solarActual"
              stroke="var(--color-secondary)"
              strokeWidth={2}
              dot={false}
              name="Solar Actual"
            />
            <Line
              type="monotone"
              dataKey="solarPredicted"
              stroke="var(--color-secondary)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Solar Predicted"
            />
            <Line
              type="monotone"
              dataKey="gridLoadActual"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={false}
              name="Grid Load Actual"
            />
            <Line
              type="monotone"
              dataKey="gridLoadPredicted"
              stroke="var(--color-primary)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Grid Load Predicted"
            />
            
            {/* Optimal charging reference line */}
            <ReferenceLine y={60} stroke="var(--color-success)" strokeDasharray="3 3" />
          </AreaChart>
        </ResponsiveContainer>
      );
    } else if (comparisonMode === 'sources') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="timeLabel" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-text-secondary)"
              fontSize={12}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            <Line
              type="monotone"
              dataKey="solarActual"
              stroke="var(--color-warning)"
              strokeWidth={3}
              dot={false}
              name="Solar Generation"
            />
            <Line
              type="monotone"
              dataKey="windActual"
              stroke="var(--color-secondary)"
              strokeWidth={3}
              dot={false}
              name="Wind Generation"
            />
            <Line
              type="monotone"
              dataKey="totalRenewableActual"
              stroke="var(--color-success)"
              strokeWidth={2}
              dot={false}
              name="Total Renewable"
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary flex items-center">
            <Icon name="TrendingUp" size={20} className="mr-2" />
            Historical vs Predicted Analysis
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            Renewable generation patterns with weather impact overlays
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select
            options={comparisonOptions}
            value={comparisonMode}
            onChange={setComparisonMode}
            className="w-48"
          />
          <Select
            options={viewModeOptions}
            value={viewMode}
            onChange={setViewMode}
            className="w-32"
          />
          <Button
            variant={showConfidenceIntervals ? "default" : "outline"}
            size="sm"
            onClick={() => setShowConfidenceIntervals(!showConfidenceIntervals)}
            iconName="Target"
            iconPosition="left"
            iconSize={16}
          >
            Confidence
          </Button>
        </div>
      </div>
      <div className="mb-6">
        {renderChart()}
      </div>
      {/* Chart insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Icon name="Sun" size={16} className="text-warning mr-2" />
            <span className="text-sm font-medium text-text-primary">Solar Performance</span>
          </div>
          <div className="text-xs text-text-secondary">
            Peak generation: 11:00-15:00<br/>
            Weather impact: {filters?.weather === 'sunny' ? '+20%' : filters?.weather === 'cloudy' ? '-20%' : 'Neutral'}
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Icon name="Wind" size={16} className="text-secondary mr-2" />
            <span className="text-sm font-medium text-text-primary">Wind Performance</span>
          </div>
          <div className="text-xs text-text-secondary">
            Variable generation<br/>
            Prediction accuracy: 78%
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Icon name="Zap" size={16} className="text-primary mr-2" />
            <span className="text-sm font-medium text-text-primary">Grid Correlation</span>
          </div>
          <div className="text-xs text-text-secondary">
            Inverse correlation: -0.72<br/>
            Optimal windows: {chartData?.filter(d => d?.optimalCharging)?.length} hours
          </div>
        </div>
      </div>
      {/* Selected range highlight */}
      {selectedTimeRange && (
        <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-center text-sm">
            <Icon name="Focus" size={16} className="text-primary mr-2" />
            <span className="text-text-primary">
              Analyzing selected time range: {selectedTimeRange?.start}:00-{selectedTimeRange?.end}:00
            </span>
            <span className="ml-2 text-primary font-medium">
              ({selectedTimeRange?.correlation?.toFixed(1)}% correlation)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineCharts;