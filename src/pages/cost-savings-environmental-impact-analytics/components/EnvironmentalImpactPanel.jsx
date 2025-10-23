import React from 'react';
import Icon from '../../../components/AppIcon';

const EnvironmentalImpactPanel = ({ data }) => {
  const ProgressBar = ({ label, value, target, color = 'primary' }) => {
    const percentage = Math.min((value / target) * 100, 100);
    
    const getColorClasses = () => {
      switch (color) {
        case 'success':
          return 'bg-success';
        case 'warning':
          return 'bg-warning';
        case 'secondary':
          return 'bg-secondary';
        default:
          return 'bg-primary';
      }
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-text-primary">{label}</span>
          <span className="text-sm text-text-secondary">
            {value?.toLocaleString()} / {target?.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${getColorClasses()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>{percentage?.toFixed(1)}% Complete</span>
          <span>{(target - value)?.toLocaleString()} remaining</span>
        </div>
      </div>
    );
  };

  const ImpactMetric = ({ icon, label, value, unit, trend }) => (
    <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
      <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
        <Icon name={icon} size={20} className="text-success" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-text-primary">{value}</span>
          <span className="text-sm text-text-secondary">{unit}</span>
          {trend && (
            <div className="flex items-center space-x-1 text-xs text-success">
              <Icon name="TrendingUp" size={12} />
              <span>{trend}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
          <Icon name="Leaf" size={20} className="text-success" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Environmental Impact</h3>
          <p className="text-sm text-text-secondary">Sustainability KPIs & Carbon Footprint</p>
        </div>
      </div>
      <div className="space-y-6">
        {/* Carbon Footprint Reduction */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-text-primary">Carbon Footprint Reduction</h4>
          <div className="grid grid-cols-1 gap-3">
            <ImpactMetric
              icon="TreePine"
              label="CO₂ Avoided"
              value={data?.co2Avoided}
              unit="tons"
              trend={12.5}
            />
            <ImpactMetric
              icon="Zap"
              label="Clean Energy Used"
              value={data?.cleanEnergyUsed}
              unit="MWh"
              trend={8.3}
            />
            <ImpactMetric
              icon="Recycle"
              label="Equivalent Trees Planted"
              value={data?.equivalentTrees}
              unit="trees"
              trend={15.2}
            />
          </div>
        </div>

        {/* Sustainability Goals Progress */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-text-primary">Sustainability Goals Progress</h4>
          <div className="space-y-4">
            <ProgressBar
              label="Annual CO₂ Reduction Target"
              value={data?.co2ReductionProgress}
              target={data?.co2ReductionTarget}
              color="success"
            />
            <ProgressBar
              label="Renewable Energy Usage Goal"
              value={data?.renewableUsageProgress}
              target={data?.renewableUsageTarget}
              color="primary"
            />
            <ProgressBar
              label="Grid Stress Reduction Target"
              value={data?.gridStressReductionProgress}
              target={data?.gridStressReductionTarget}
              color="secondary"
            />
          </div>
        </div>

        {/* Environmental Certifications */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-text-primary">Certifications & Standards</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2 p-2 bg-success/10 rounded-md">
              <Icon name="Award" size={16} className="text-success" />
              <span className="text-xs font-medium text-success">ISO 14001</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-primary/10 rounded-md">
              <Icon name="Shield" size={16} className="text-primary" />
              <span className="text-xs font-medium text-primary">LEED Gold</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-secondary/10 rounded-md">
              <Icon name="CheckCircle" size={16} className="text-secondary" />
              <span className="text-xs font-medium text-secondary">Carbon Neutral</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-warning/10 rounded-md">
              <Icon name="Star" size={16} className="text-warning" />
              <span className="text-xs font-medium text-warning">Energy Star</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalImpactPanel;