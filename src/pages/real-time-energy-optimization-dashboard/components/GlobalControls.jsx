import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const GlobalControls = ({ onTimeRangeChange, onLocationChange, onAutoRefreshToggle }) => {
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(15);

  const timeRangeOptions = [
    { value: '1h', label: 'Last Hour' },
    { value: '6h', label: 'Last 6 Hours' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    { value: 'downtown', label: 'Downtown Campus' },
    { value: 'north', label: 'North Facility' },
    { value: 'south', label: 'South Facility' },
    { value: 'warehouse', label: 'Warehouse District' }
  ];

  const refreshIntervalOptions = [
    { value: 5, label: '5 seconds' },
    { value: 15, label: '15 seconds' },
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' }
  ];

  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
    onTimeRangeChange?.(value);
  };

  const handleLocationChange = (value) => {
    setSelectedLocation(value);
    onLocationChange?.(value);
  };

  const handleAutoRefreshToggle = () => {
    const newAutoRefresh = !autoRefresh;
    setAutoRefresh(newAutoRefresh);
    onAutoRefreshToggle?.(newAutoRefresh, refreshInterval);
  };

  const handleRefreshIntervalChange = (value) => {
    setRefreshInterval(value);
    if (autoRefresh) {
      onAutoRefreshToggle?.(true, value);
    }
  };

  return (
    <div className="data-card p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left Side - Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="flex items-center space-x-3">
            <Icon name="Clock" size={20} className="text-muted-foreground" />
            <Select
              options={timeRangeOptions}
              value={timeRange}
              onChange={handleTimeRangeChange}
              placeholder="Select time range"
              className="w-40"
            />
          </div>

          <div className="flex items-center space-x-3">
            <Icon name="MapPin" size={20} className="text-muted-foreground" />
            <Select
              options={locationOptions}
              value={selectedLocation}
              onChange={handleLocationChange}
              placeholder="Select location"
              className="w-48"
            />
          </div>
        </div>

        {/* Right Side - Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          {/* Auto Refresh Controls */}
          <div className="flex items-center space-x-3">
            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={handleAutoRefreshToggle}
              iconName={autoRefresh ? "Pause" : "Play"}
              iconPosition="left"
              iconSize={14}
            >
              {autoRefresh ? 'Auto Refresh On' : 'Auto Refresh Off'}
            </Button>

            {autoRefresh && (
              <Select
                options={refreshIntervalOptions}
                value={refreshInterval}
                onChange={handleRefreshIntervalChange}
                className="w-32"
              />
            )}
          </div>

          {/* Manual Refresh */}
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
            iconSize={14}
          >
            Refresh Now
          </Button>

          {/* Export Data */}
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            iconSize={14}
          >
            Export
          </Button>
        </div>
      </div>
      {/* Status Indicators */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-xs text-muted-foreground">
                Data Connection: Active
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Icon name="Wifi" size={14} className="text-success" />
              <span className="text-xs text-muted-foreground">
                Grid API: Connected
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Icon name="Sun" size={14} className="text-renewable" />
              <span className="text-xs text-muted-foreground">
                Renewable API: Active
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-xs text-muted-foreground">
              Last Updated: {new Date()?.toLocaleTimeString()}
            </div>
            
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={14} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                3 operators online
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalControls;