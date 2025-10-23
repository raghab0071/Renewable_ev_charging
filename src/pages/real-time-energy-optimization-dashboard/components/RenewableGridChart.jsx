import React, { useState, useEffect } from 'react';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const RenewableGridChart = ({ timeRange = '24h' }) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setIsLoading(true);
    const timer = setTimeout(() => {
      generateMockData();
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeRange]);

  const generateMockData = () => {
    const now = new Date();
    const dataPoints = timeRange === '1h' ? 12 : timeRange === '24h' ? 24 : 48;
    const interval = timeRange === '1h' ? 5 : timeRange === '24h' ? 60 : 120;

    const data = [];
    for (let i = dataPoints - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - (i * interval * 60000));
      const hour = time?.getHours();
      
      // Simulate renewable energy patterns (higher during day)
      const solarBase = hour >= 6 && hour <= 18 ? 
        Math.sin((hour - 6) * Math.PI / 12) * 60 + 20 : 5;
      const windBase = 30 + Math.sin(hour * Math.PI / 12) * 25;
      
      const renewableGeneration = Math.max(0, 
        solarBase + windBase + (Math.random() - 0.5) * 20
      );

      // Simulate grid load patterns (higher during peak hours)
      const peakHours = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 21);
      const gridLoad = peakHours ? 
        70 + Math.random() * 25 : 
        40 + Math.random() * 20;

      data?.push({
        time: time?.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        renewableGeneration: Math.round(renewableGeneration),
        gridLoad: Math.round(gridLoad),
        optimalChargingWindow: renewableGeneration > gridLoad ? renewableGeneration : null
      });
    }
    setChartData(data);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-surface border border-border rounded-lg shadow-lg p-4">
          <p className="text-sm font-medium text-text-primary mb-2">{`Time: ${label}`}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-sm text-text-secondary">
                {entry?.name}: {entry?.value}%
              </span>
            </div>
          ))}
          {payload?.[0]?.payload?.optimalChargingWindow && (
            <div className="mt-2 pt-2 border-t border-border">
              <div className="flex items-center space-x-2">
                <Icon name="Zap" size={14} className="text-success" />
                <span className="text-xs text-success font-medium">
                  Optimal Charging Window
                </span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="data-card p-6 h-96">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-text-primary">
            Renewable Energy vs Grid Load
          </h2>
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-20"></div>
          </div>
        </div>
        <div className="flex items-center justify-center h-80">
          <div className="animate-spin">
            <Icon name="Loader2" size={32} className="text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="data-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Renewable Energy vs Grid Load
          </h2>
          <p className="text-sm text-muted-foreground">
            Real-time correlation analysis for optimal charging windows
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-renewable rounded-full" />
            <span className="text-xs text-muted-foreground">Renewable</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-grid-data rounded-full" />
            <span className="text-xs text-muted-foreground">Grid Load</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="var(--color-text-secondary)"
              fontSize={12}
              tickLine={false}
              label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            <Area
              type="monotone"
              dataKey="renewableGeneration"
              name="Renewable Generation"
              stroke="var(--color-renewable)"
              fill="var(--color-renewable)"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            
            <Line
              type="monotone"
              dataKey="gridLoad"
              name="Grid Load"
              stroke="var(--color-grid-data)"
              strokeWidth={3}
              dot={{ fill: 'var(--color-grid-data)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-grid-data)', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3 p-3 bg-renewable/10 rounded-lg">
          <Icon name="Sun" size={20} className="text-renewable" />
          <div>
            <p className="text-sm font-medium text-text-primary">Peak Solar</p>
            <p className="text-xs text-muted-foreground">12:30 PM - 85%</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-grid-data/10 rounded-lg">
          <Icon name="Zap" size={20} className="text-grid-data" />
          <div>
            <p className="text-sm font-medium text-text-primary">Grid Peak</p>
            <p className="text-xs text-muted-foreground">7:00 PM - 92%</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-success/10 rounded-lg">
          <Icon name="Target" size={20} className="text-success" />
          <div>
            <p className="text-sm font-medium text-text-primary">Optimal Window</p>
            <p className="text-xs text-muted-foreground">11:00 AM - 2:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenewableGridChart;