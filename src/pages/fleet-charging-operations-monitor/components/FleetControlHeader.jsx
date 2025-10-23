import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FleetControlHeader = ({ 
  selectedFleet, 
  fleetOptions, 
  onFleetChange, 
  locationFilters, 
  onLocationFilterChange,
  alertThresholds,
  onAlertThresholdChange,
  emergencyOverride,
  onEmergencyOverride 
}) => {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showAlertSettings, setShowAlertSettings] = useState(false);
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);

  const handleEmergencyClick = () => {
    if (emergencyOverride?.active) {
      onEmergencyOverride && onEmergencyOverride(false);
    } else {
      setShowEmergencyConfirm(true);
    }
  };

  const confirmEmergencyOverride = () => {
    onEmergencyOverride && onEmergencyOverride(true);
    setShowEmergencyConfirm(false);
  };

  return (
    <div className="bg-card border-b border-border p-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Fleet Selection */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Truck" size={20} color="white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">Fleet Operations</h1>
              <p className="text-sm text-text-secondary">Real-time charging coordination</p>
            </div>
          </div>

          {/* Fleet Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-text-secondary">Fleet:</label>
            <select
              value={selectedFleet}
              onChange={(e) => onFleetChange && onFleetChange(e?.target?.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-text-primary min-w-32"
            >
              {fleetOptions?.map((fleet) => (
                <option key={fleet?.id} value={fleet?.id}>
                  {fleet?.name} ({fleet?.vehicleCount})
                </option>
              ))}
            </select>
          </div>

          {/* Location Filters */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              iconName="MapPin"
              iconPosition="left"
              iconSize={16}
            >
              Locations ({locationFilters?.active?.length})
            </Button>
            
            {showLocationDropdown && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-surface border border-border rounded-lg shadow-modal z-50">
                <div className="p-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-text-primary">Filter by Location</span>
                    <button
                      onClick={() => setShowLocationDropdown(false)}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <Icon name="X" size={14} className="text-text-secondary" />
                    </button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {locationFilters?.available?.map((location) => (
                      <label key={location?.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={locationFilters?.active?.includes(location?.id)}
                          onChange={(e) => onLocationFilterChange && onLocationFilterChange(location?.id, e?.target?.checked)}
                          className="rounded border-border"
                        />
                        <span className="text-sm text-text-primary">{location?.name}</span>
                        <span className="text-xs text-text-secondary">({location?.stationCount})</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Controls */}
        <div className="flex items-center space-x-4">
          {/* Alert Threshold Settings */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAlertSettings(!showAlertSettings)}
              iconName="Bell"
              iconPosition="left"
              iconSize={16}
            >
              Alert Settings
            </Button>
            
            {showAlertSettings && (
              <div className="absolute top-full right-0 mt-1 w-80 bg-surface border border-border rounded-lg shadow-modal z-50">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-text-primary">Alert Thresholds</span>
                    <button
                      onClick={() => setShowAlertSettings(false)}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <Icon name="X" size={14} className="text-text-secondary" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Battery Low Warning (%)
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="50"
                        value={alertThresholds?.batteryLow}
                        onChange={(e) => onAlertThresholdChange && onAlertThresholdChange('batteryLow', e?.target?.value)}
                        className="w-full"
                      />
                      <span className="text-xs text-text-secondary">{alertThresholds?.batteryLow}%</span>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Queue Length Alert
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="20"
                        value={alertThresholds?.queueLength}
                        onChange={(e) => onAlertThresholdChange && onAlertThresholdChange('queueLength', e?.target?.value)}
                        className="w-full"
                      />
                      <span className="text-xs text-text-secondary">{alertThresholds?.queueLength} vehicles</span>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Grid Load Warning (%)
                      </label>
                      <input
                        type="range"
                        min="70"
                        max="95"
                        value={alertThresholds?.gridLoad}
                        onChange={(e) => onAlertThresholdChange && onAlertThresholdChange('gridLoad', e?.target?.value)}
                        className="w-full"
                      />
                      <span className="text-xs text-text-secondary">{alertThresholds?.gridLoad}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* System Status Indicator */}
          <div className="flex items-center space-x-2 px-3 py-2 bg-muted/30 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-success">Live</span>
            <span className="text-xs text-text-secondary">
              {new Date()?.toLocaleTimeString()}
            </span>
          </div>

          {/* Emergency Override */}
          <div className="relative">
            <Button
              variant={emergencyOverride?.active ? "destructive" : "outline"}
              size="sm"
              onClick={handleEmergencyClick}
              iconName="AlertTriangle"
              iconPosition="left"
              iconSize={16}
              className={emergencyOverride?.active ? "animate-pulse" : ""}
            >
              {emergencyOverride?.active ? "Override Active" : "Emergency Override"}
            </Button>
            
            {showEmergencyConfirm && (
              <div className="absolute top-full right-0 mt-1 w-72 bg-surface border border-error rounded-lg shadow-modal z-50">
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Icon name="AlertTriangle" size={20} className="text-error" />
                    <span className="text-sm font-medium text-text-primary">Emergency Override</span>
                  </div>
                  <p className="text-xs text-text-secondary mb-4">
                    This will immediately stop all charging operations and override automated scheduling. 
                    Use only in emergency situations.
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={confirmEmergencyOverride}
                    >
                      Confirm Override
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowEmergencyConfirm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Emergency Override Status Banner */}
      {emergencyOverride?.active && (
        <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-error" />
              <span className="text-sm font-medium text-error">Emergency Override Active</span>
              <span className="text-xs text-text-secondary">
                Activated at {emergencyOverride?.timestamp}
              </span>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={() => onEmergencyOverride && onEmergencyOverride(false)}
            >
              Deactivate
            </Button>
          </div>
        </div>
      )}
      {/* Click outside handlers */}
      {showLocationDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowLocationDropdown(false)}
        />
      )}
      {showAlertSettings && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowAlertSettings(false)}
        />
      )}
      {showEmergencyConfirm && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowEmergencyConfirm(false)}
        />
      )}
    </div>
  );
};

export default FleetControlHeader;