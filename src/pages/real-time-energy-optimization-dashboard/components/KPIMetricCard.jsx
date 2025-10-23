import React from 'react';
import Icon from '../../../components/AppIcon';

const KPIMetricCard = ({ 
  title, 
  value, 
  unit, 
  trend, 
  trendValue, 
  icon, 
  color = 'primary',
  description,
  status 
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'renewable':
        return 'border-l-renewable text-renewable';
      case 'grid':
        return 'border-l-grid-data text-grid-data';
      case 'cost':
        return 'border-l-cost-metric text-cost-metric';
      case 'success':
        return 'border-l-success text-success';
      case 'warning':
        return 'border-l-warning text-warning';
      case 'error':
        return 'border-l-error text-error';
      default:
        return 'border-l-primary text-primary';
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-muted-foreground';
  };

  const getStatusIndicator = () => {
    if (!status) return null;
    
    const statusConfig = {
      optimal: { color: 'bg-success', label: 'Optimal' },
      warning: { color: 'bg-warning', label: 'Warning' },
      critical: { color: 'bg-error', label: 'Critical' },
      normal: { color: 'bg-primary', label: 'Normal' }
    };

    const config = statusConfig?.[status] || statusConfig?.normal;
    
    return (
      <div className="flex items-center space-x-2 mt-2">
        <div className={`w-2 h-2 rounded-full ${config?.color}`} />
        <span className="text-xs text-muted-foreground">{config?.label}</span>
      </div>
    );
  };

  return (
    <div className={`data-card p-6 border-l-4 ${getColorClasses()} hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name={icon} size={20} className={getColorClasses()?.split(' ')?.[1]} />
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </h3>
          </div>
          
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-text-primary">
              {value}
            </span>
            {unit && (
              <span className="text-lg text-muted-foreground">
                {unit}
              </span>
            )}
          </div>

          {description && (
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          )}

          {getStatusIndicator()}
        </div>

        {trend && trendValue && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            <Icon name={getTrendIcon()} size={16} />
            <span className="text-sm font-medium">
              {trendValue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPIMetricCard;