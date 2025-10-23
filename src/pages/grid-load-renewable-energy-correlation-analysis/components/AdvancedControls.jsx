import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const AdvancedControls = ({ onScenarioChange, onForecastHorizonChange, onComparisonChange }) => {
  const [activeScenario, setActiveScenario] = useState('current');
  const [forecastHorizon, setForecastHorizon] = useState(24);
  const [comparisonSources, setComparisonSources] = useState(['solar', 'wind']);
  const [showScenarioBuilder, setShowScenarioBuilder] = useState(false);
  const [customScenario, setCustomScenario] = useState({
    name: '',
    solarCapacity: 100,
    windCapacity: 100,
    gridStability: 100,
    weatherCondition: 'normal'
  });

  const scenarioOptions = [
    { value: 'current', label: 'Current Conditions' },
    { value: 'high_renewable', label: 'High Renewable Scenario' },
    { value: 'peak_demand', label: 'Peak Demand Scenario' },
    { value: 'weather_impact', label: 'Adverse Weather' },
    { value: 'grid_stress', label: 'Grid Stress Test' },
    { value: 'custom', label: 'Custom Scenario' }
  ];

  const forecastHorizonOptions = [
    { value: 1, label: '1 Hour' },
    { value: 6, label: '6 Hours' },
    { value: 12, label: '12 Hours' },
    { value: 24, label: '24 Hours' },
    { value: 48, label: '48 Hours' },
    { value: 72, label: '72 Hours' }
  ];

  const renewableSourceOptions = [
    { value: 'solar', label: 'Solar' },
    { value: 'wind', label: 'Wind' },
    { value: 'hydro', label: 'Hydro' },
    { value: 'geothermal', label: 'Geothermal' }
  ];

  const weatherConditionOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'sunny', label: 'Sunny' },
    { value: 'cloudy', label: 'Cloudy' },
    { value: 'windy', label: 'Windy' },
    { value: 'stormy', label: 'Stormy' }
  ];

  const handleScenarioChange = (scenario) => {
    setActiveScenario(scenario);
    if (scenario === 'custom') {
      setShowScenarioBuilder(true);
    } else {
      onScenarioChange(scenario);
    }
  };

  const handleForecastHorizonChange = (horizon) => {
    setForecastHorizon(horizon);
    onForecastHorizonChange(horizon);
  };

  const handleComparisonSourcesChange = (sources) => {
    setComparisonSources(sources);
    onComparisonChange(sources);
  };

  const handleCustomScenarioSave = () => {
    if (customScenario?.name?.trim()) {
      onScenarioChange({
        type: 'custom',
        ...customScenario
      });
      setShowScenarioBuilder(false);
    }
  };

  const runSimulation = () => {
    // Trigger simulation with current parameters
    const simulationParams = {
      scenario: activeScenario,
      forecastHorizon,
      comparisonSources,
      timestamp: new Date()?.toISOString()
    };
    
    console.log('Running simulation with params:', simulationParams);
    // In a real app, this would trigger the simulation API call
  };

  return (
    <div className="space-y-6">
      {/* Scenario Modeling */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary flex items-center mb-4">
          <Icon name="Settings" size={20} className="mr-2" />
          Scenario Modeling
        </h3>

        <div className="space-y-4">
          <div>
            <Select
              label="Analysis Scenario"
              options={scenarioOptions}
              value={activeScenario}
              onChange={handleScenarioChange}
              description="Select predefined scenario or create custom"
            />
          </div>

          <div>
            <Select
              label="Forecast Horizon"
              options={forecastHorizonOptions}
              value={forecastHorizon}
              onChange={handleForecastHorizonChange}
              description="Prediction time range for analysis"
            />
          </div>

          <div>
            <Select
              label="Comparison Sources"
              options={renewableSourceOptions}
              value={comparisonSources}
              onChange={handleComparisonSourcesChange}
              multiple
              description="Select renewable sources to compare"
            />
          </div>

          <Button
            variant="default"
            onClick={runSimulation}
            iconName="Play"
            iconPosition="left"
            iconSize={16}
            fullWidth
          >
            Run Simulation
          </Button>
        </div>
      </div>
      {/* Scenario Parameters */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-md font-semibold text-text-primary flex items-center mb-4">
          <Icon name="Sliders" size={18} className="mr-2" />
          Scenario Parameters
        </h4>

        <div className="space-y-4">
          {/* Solar Capacity Slider */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Solar Capacity: {customScenario?.solarCapacity}%
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={customScenario?.solarCapacity}
              onChange={(e) => setCustomScenario({
                ...customScenario,
                solarCapacity: parseInt(e?.target?.value)
              })}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>0%</span>
              <span>100%</span>
              <span>200%</span>
            </div>
          </div>

          {/* Wind Capacity Slider */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Wind Capacity: {customScenario?.windCapacity}%
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={customScenario?.windCapacity}
              onChange={(e) => setCustomScenario({
                ...customScenario,
                windCapacity: parseInt(e?.target?.value)
              })}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>0%</span>
              <span>100%</span>
              <span>200%</span>
            </div>
          </div>

          {/* Grid Stability Slider */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Grid Stability: {customScenario?.gridStability}%
            </label>
            <input
              type="range"
              min="50"
              max="100"
              value={customScenario?.gridStability}
              onChange={(e) => setCustomScenario({
                ...customScenario,
                gridStability: parseInt(e?.target?.value)
              })}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Weather Condition */}
          <div>
            <Select
              label="Weather Condition"
              options={weatherConditionOptions}
              value={customScenario?.weatherCondition}
              onChange={(value) => setCustomScenario({
                ...customScenario,
                weatherCondition: value
              })}
            />
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-md font-semibold text-text-primary flex items-center mb-4">
          <Icon name="Zap" size={18} className="mr-2" />
          Quick Actions
        </h4>

        <div className="grid grid-cols-1 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleScenarioChange('high_renewable')}
            iconName="Sun"
            iconPosition="left"
            iconSize={16}
            fullWidth
          >
            Optimize for High Renewable
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleScenarioChange('peak_demand')}
            iconName="TrendingUp"
            iconPosition="left"
            iconSize={16}
            fullWidth
          >
            Analyze Peak Demand
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleScenarioChange('weather_impact')}
            iconName="Cloud"
            iconPosition="left"
            iconSize={16}
            fullWidth
          >
            Weather Impact Analysis
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleScenarioChange('grid_stress')}
            iconName="AlertTriangle"
            iconPosition="left"
            iconSize={16}
            fullWidth
          >
            Grid Stress Test
          </Button>
        </div>
      </div>
      {/* Simulation Results Summary */}
      <div className="bg-muted/50 border border-border rounded-lg p-6">
        <h4 className="text-md font-semibold text-text-primary flex items-center mb-4">
          <Icon name="BarChart3" size={18} className="mr-2" />
          Simulation Summary
        </h4>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">Active Scenario:</span>
            <span className="text-text-primary font-medium">
              {scenarioOptions?.find(s => s?.value === activeScenario)?.label}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-text-secondary">Forecast Range:</span>
            <span className="text-text-primary font-medium">
              {forecastHorizon} hours
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-text-secondary">Sources Compared:</span>
            <span className="text-text-primary font-medium">
              {comparisonSources?.length} sources
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-text-secondary">Last Simulation:</span>
            <span className="text-text-primary font-medium font-mono">
              {new Date()?.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
      {/* Custom Scenario Builder Modal */}
      {showScenarioBuilder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-card border border-border rounded-lg p-6 w-96 max-w-[90vw] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Custom Scenario Builder</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowScenarioBuilder(false)}
                iconName="X"
                iconSize={16}
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Scenario Name
                </label>
                <input
                  type="text"
                  placeholder="Enter scenario name..."
                  value={customScenario?.name}
                  onChange={(e) => setCustomScenario({
                    ...customScenario,
                    name: e?.target?.value
                  })}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowScenarioBuilder(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleCustomScenarioSave}
                  disabled={!customScenario?.name?.trim()}
                >
                  Save Scenario
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedControls;