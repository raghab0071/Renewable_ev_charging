import React from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart, Bar } from 'recharts';

const RenewableCorrelationChart = ({ data, showConfidenceInterval = true }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-4 shadow-lg">
          <p className="text-sm font-medium text-text-primary mb-3">{label}</p>
          <div className="space-y-2">
            {payload?.map((entry, index) => (
              <div key={index} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry?.color }}
                  />
                  <span className="text-sm text-text-secondary">{entry?.name}</span>
                </div>
                <span className="text-sm font-medium text-text-primary">
                  {entry?.dataKey === 'renewableAvailability' || entry?.dataKey === 'chargingEfficiency' 
                    ? `${entry?.value}%` 
                    : entry?.value?.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          {payload?.some(p => p?.dataKey === 'correlation') && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Correlation Strength:</span>
                <span className="text-sm font-medium text-primary">
                  {payload?.find(p => p?.dataKey === 'correlation')?.value > 0.7 ? 'Strong' : 
                   payload?.find(p => p?.dataKey === 'correlation')?.value > 0.4 ? 'Moderate' : 'Weak'}
                </span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Renewable Energy Correlation Analysis</h3>
          <p className="text-sm text-text-secondary">Renewable availability vs charging efficiency with predictive confidence intervals</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-renewable rounded-full" />
            <span className="text-sm text-text-secondary">Renewable Availability</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span className="text-sm text-text-secondary">Charging Efficiency</span>
          </div>
          {showConfidenceInterval && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning/50 rounded-full" />
              <span className="text-sm text-text-secondary">Confidence Interval</span>
            </div>
          )}
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <YAxis 
              yAxisId="left"
              stroke="var(--color-text-secondary)"
              fontSize={12}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="var(--color-text-secondary)"
              fontSize={12}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Confidence Interval Area */}
            {showConfidenceInterval && (
              <>
                <Area
                  yAxisId="left"
                  dataKey="confidenceUpper"
                  stackId="confidence"
                  stroke="none"
                  fill="var(--color-warning)"
                  fillOpacity={0.1}
                />
                <Area
                  yAxisId="left"
                  dataKey="confidenceLower"
                  stackId="confidence"
                  stroke="none"
                  fill="var(--color-surface)"
                  fillOpacity={1}
                />
              </>
            )}
            
            {/* Main Lines */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="renewableAvailability"
              name="Renewable Availability"
              stroke="var(--color-renewable)"
              strokeWidth={3}
              dot={{ fill: 'var(--color-renewable)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-renewable)', strokeWidth: 2 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="chargingEfficiency"
              name="Charging Efficiency"
              stroke="var(--color-primary)"
              strokeWidth={3}
              dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
            />
            
            {/* Correlation Strength Bars */}
            <Bar
              yAxisId="right"
              dataKey="correlationStrength"
              name="Correlation Strength"
              fill="var(--color-accent)"
              fillOpacity={0.3}
              radius={[2, 2, 0, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Correlation Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span className="text-sm font-medium text-text-primary">Strong Correlation</span>
          </div>
          <p className="text-2xl font-bold text-success">78.5%</p>
          <p className="text-xs text-text-secondary">Peak renewable hours</p>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <span className="text-sm font-medium text-text-primary">Avg Efficiency Gain</span>
          </div>
          <p className="text-2xl font-bold text-primary">23.2%</p>
          <p className="text-xs text-text-secondary">During high renewable periods</p>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-warning rounded-full" />
            <span className="text-sm font-medium text-text-primary">Prediction Accuracy</span>
          </div>
          <p className="text-2xl font-bold text-warning">91.7%</p>
          <p className="text-xs text-text-secondary">24-hour forecast confidence</p>
        </div>
      </div>
    </div>
  );
};

export default RenewableCorrelationChart;