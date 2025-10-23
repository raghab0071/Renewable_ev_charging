import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActiveChargingSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);

  const updateSessions = () => {
    setSessions(prev => prev?.map(session => ({
      ...session,
      currentCharge: Math.min(session?.targetCharge, session?.currentCharge + Math.random() * 2),
      totalCost: session?.totalCost + (Math.random() * 0.5)
    })));
  };

  useEffect(() => {
    generateSessions();
    const interval = setInterval(updateSessions, 15000); // Update every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const generateSessions = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const mockSessions = [
        {
          id: "CS-001",
          vehicleName: "Tesla Model S",
          stationId: "Station A1",
          startTime: new Date(Date.now() - 1800000), // 30 minutes ago
          currentCharge: 65,
          targetCharge: 90,
          chargingRate: 45, // kW
          estimatedCompletion: new Date(Date.now() + 1200000), // 20 minutes from now
          energySource: "renewable",
          renewablePercentage: 85,
          costPerKwh: 0.12,
          totalCost: 8.50,
          status: "charging",
          canOverride: true
        },
        {
          id: "CS-002",
          vehicleName: "BMW i4",
          stationId: "Station B2",
          startTime: new Date(Date.now() - 2700000), // 45 minutes ago
          currentCharge: 80,
          targetCharge: 100,
          chargingRate: 22, // kW
          estimatedCompletion: new Date(Date.now() + 900000), // 15 minutes from now
          energySource: "mixed",
          renewablePercentage: 60,
          costPerKwh: 0.15,
          totalCost: 12.30,
          status: "charging",
          canOverride: true
        },
        {
          id: "CS-003",
          vehicleName: "Audi e-tron",
          stationId: "Station C3",
          startTime: new Date(Date.now() - 3600000), // 1 hour ago
          currentCharge: 95,
          targetCharge: 100,
          chargingRate: 11, // kW (tapering)
          estimatedCompletion: new Date(Date.now() + 300000), // 5 minutes from now
          energySource: "grid",
          renewablePercentage: 25,
          costPerKwh: 0.18,
          totalCost: 15.75,
          status: "completing",
          canOverride: false
        },
        {
          id: "CS-004",
          vehicleName: "Nissan Leaf",
          stationId: "Station D4",
          startTime: new Date(Date.now() - 600000), // 10 minutes ago
          currentCharge: 35,
          targetCharge: 80,
          chargingRate: 50, // kW
          estimatedCompletion: new Date(Date.now() + 2400000), // 40 minutes from now
          energySource: "renewable",
          renewablePercentage: 92,
          costPerKwh: 0.10,
          totalCost: 4.20,
          status: "charging",
          canOverride: true
        },
        {
          id: "CS-005",
          vehicleName: "Ford Mustang Mach-E",
          stationId: "Station E5",
          startTime: new Date(Date.now() - 300000), // 5 minutes ago
          currentCharge: 20,
          targetCharge: 85,
          chargingRate: 75, // kW
          estimatedCompletion: new Date(Date.now() + 3000000), // 50 minutes from now
          energySource: "mixed",
          renewablePercentage: 70,
          costPerKwh: 0.14,
          totalCost: 2.10,
          status: "charging",
          canOverride: true
        }
      ];
      
      setSessions(mockSessions);
      setIsLoading(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'charging': return 'text-primary';
      case 'completing': return 'text-success';
      case 'paused': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'charging': return 'Zap';
      case 'completing': return 'CheckCircle';
      case 'paused': return 'Pause';
      case 'error': return 'AlertCircle';
      default: return 'Circle';
    }
  };

  const getEnergySourceColor = (source) => {
    switch (source) {
      case 'renewable': return 'text-renewable';
      case 'mixed': return 'text-warning';
      case 'grid': return 'text-grid-data';
      default: return 'text-muted-foreground';
    }
  };

  const formatDuration = (startTime) => {
    const duration = Date.now() - startTime?.getTime();
    const minutes = Math.floor(duration / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const formatTimeRemaining = (completionTime) => {
    const remaining = completionTime?.getTime() - Date.now();
    const minutes = Math.floor(remaining / 60000);
    
    if (minutes <= 0) return 'Completing...';
    
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  const handleStopCharging = (sessionId) => {
    setSessions(prev => prev?.filter(session => session?.id !== sessionId));
  };

  const handlePauseCharging = (sessionId) => {
    setSessions(prev => prev?.map(session => 
      session?.id === sessionId 
        ? { ...session, status: session?.status === 'paused' ? 'charging' : 'paused' }
        : session
    ));
  };

  if (isLoading) {
    return (
      <div className="data-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-text-primary">
            Active Charging Sessions
          </h2>
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-12"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3]?.map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="data-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Active Charging Sessions
          </h2>
          <p className="text-sm text-muted-foreground">
            {sessions?.length} vehicles currently charging
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">Live Updates</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
            iconSize={14}
            onClick={generateSessions}
          >
            Refresh
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sessions?.map((session) => (
          <div 
            key={session?.id} 
            className="border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-surface"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-text-primary">
                  {session?.vehicleName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {session?.stationId}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Icon 
                  name={getStatusIcon(session?.status)} 
                  size={16} 
                  className={getStatusColor(session?.status)} 
                />
                <span className={`text-xs font-medium capitalize ${getStatusColor(session?.status)}`}>
                  {session?.status}
                </span>
              </div>
            </div>

            {/* Battery Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Battery Level</span>
                <span className="text-sm font-medium text-text-primary">
                  {Math.round(session?.currentCharge)}% / {session?.targetCharge}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-500 relative"
                  style={{ width: `${(session?.currentCharge / 100) * 100}%` }}
                >
                  <div 
                    className="absolute top-0 right-0 w-1 h-3 bg-border"
                    style={{ right: `${100 - session?.targetCharge}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Charging Details */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Charging Rate</p>
                <p className="text-sm font-medium text-text-primary">
                  {session?.chargingRate} kW
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Duration</p>
                <p className="text-sm font-medium text-text-primary">
                  {formatDuration(session?.startTime)}
                </p>
              </div>
            </div>

            {/* Energy Source */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Energy Source</span>
                <span className={`text-xs font-medium capitalize ${getEnergySourceColor(session?.energySource)}`}>
                  {session?.energySource}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div 
                    className="bg-renewable h-2 rounded-full transition-all duration-300"
                    style={{ width: `${session?.renewablePercentage}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {session?.renewablePercentage}%
                </span>
              </div>
            </div>

            {/* Cost and Time */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
                <p className="text-sm font-semibold text-cost-metric">
                  ${session?.totalCost?.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Rate</p>
                <p className="text-sm font-medium text-text-primary">
                  ${session?.costPerKwh}/kWh
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              {formatTimeRemaining(session?.estimatedCompletion)}
            </p>

            {/* Control Buttons */}
            {session?.canOverride && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePauseCharging(session?.id)}
                  iconName={session?.status === 'paused' ? 'Play' : 'Pause'}
                  iconPosition="left"
                  iconSize={14}
                  className="flex-1"
                >
                  {session?.status === 'paused' ? 'Resume' : 'Pause'}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleStopCharging(session?.id)}
                  iconName="Square"
                  iconPosition="left"
                  iconSize={14}
                  className="flex-1"
                >
                  Stop
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
      {sessions?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Zap" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            No Active Charging Sessions
          </h3>
          <p className="text-muted-foreground">
            All vehicles are fully charged or not connected
          </p>
        </div>
      )}
    </div>
  );
};

export default ActiveChargingSessions;