import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChargingRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const generateRecommendations = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const mockRecommendations = [
        {
          id: 1,
          vehicleId: "EV-001",
          vehicleName: "Tesla Model 3",
          priority: "high",
          recommendedStart: "11:30 AM",
          recommendedEnd: "1:45 PM",
          estimatedSavings: "$12.50",
          renewablePercentage: 85,
          reason: "Peak solar generation window",
          batteryLevel: 45,
          targetLevel: 90,
          status: "pending"
        },
        {
          id: 2,
          vehicleId: "EV-002",
          vehicleName: "Nissan Leaf",
          priority: "medium",
          recommendedStart: "2:00 PM",
          recommendedEnd: "4:30 PM",
          estimatedSavings: "$8.75",
          renewablePercentage: 72,
          reason: "Low grid demand period",
          batteryLevel: 60,
          targetLevel: 100,
          status: "pending"
        },
        {
          id: 3,
          vehicleId: "EV-003",
          vehicleName: "BMW i3",
          priority: "low",
          recommendedStart: "10:00 PM",
          recommendedEnd: "6:00 AM",
          estimatedSavings: "$15.20",
          renewablePercentage: 45,
          reason: "Off-peak rates available",
          batteryLevel: 25,
          targetLevel: 80,
          status: "scheduled"
        },
        {
          id: 4,
          vehicleId: "EV-004",
          vehicleName: "Chevrolet Bolt",
          priority: "high",
          recommendedStart: "Now",
          recommendedEnd: "12:00 PM",
          estimatedSavings: "$6.30",
          renewablePercentage: 78,
          reason: "Critical battery level",
          batteryLevel: 15,
          targetLevel: 50,
          status: "urgent"
        }
      ];
      
      setRecommendations(mockRecommendations);
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    generateRecommendations();
    const interval = setInterval(generateRecommendations, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'Clock';
      case 'low': return 'CheckCircle';
      default: return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'urgent': return 'bg-error/10 border-error text-error';
      case 'pending': return 'bg-warning/10 border-warning text-warning';
      case 'scheduled': return 'bg-success/10 border-success text-success';
      default: return 'bg-muted border-border text-muted-foreground';
    }
  };

  const handleAcceptRecommendation = (id) => {
    setRecommendations(prev => 
      prev?.map(rec => 
        rec?.id === id 
          ? { ...rec, status: 'scheduled' }
          : rec
      )
    );
  };

  const handleRejectRecommendation = (id) => {
    setRecommendations(prev => prev?.filter(rec => rec?.id !== id));
  };

  if (isLoading) {
    return (
      <div className="data-card p-6 h-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-text-primary">
            Charging Recommendations
          </h2>
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-16"></div>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3]?.map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-muted rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="data-card p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Charging Recommendations
          </h2>
          <p className="text-sm text-muted-foreground">
            AI-optimized charging schedules
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {recommendations?.map((rec) => (
          <div 
            key={rec?.id} 
            className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${getStatusColor(rec?.status)}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Icon 
                  name={getPriorityIcon(rec?.priority)} 
                  size={16} 
                  className={getPriorityColor(rec?.priority)} 
                />
                <div>
                  <h3 className="font-medium text-text-primary">
                    {rec?.vehicleName}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {rec?.vehicleId}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-success">
                  {rec?.estimatedSavings}
                </p>
                <p className="text-xs text-muted-foreground">
                  savings
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Recommended Window
                </p>
                <p className="text-sm font-medium text-text-primary">
                  {rec?.recommendedStart} - {rec?.recommendedEnd}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Renewable Energy
                </p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-renewable h-2 rounded-full transition-all duration-300"
                      style={{ width: `${rec?.renewablePercentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-text-primary">
                    {rec?.renewablePercentage}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Current</p>
                  <p className="text-sm font-medium text-text-primary">
                    {rec?.batteryLevel}%
                  </p>
                </div>
                <Icon name="ArrowRight" size={14} className="text-muted-foreground" />
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Target</p>
                  <p className="text-sm font-medium text-text-primary">
                    {rec?.targetLevel}%
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              <Icon name="Info" size={12} className="inline mr-1" />
              {rec?.reason}
            </p>

            {rec?.status === 'pending' && (
              <div className="flex space-x-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleAcceptRecommendation(rec?.id)}
                  iconName="Check"
                  iconPosition="left"
                  iconSize={14}
                  className="flex-1"
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRejectRecommendation(rec?.id)}
                  iconName="X"
                  iconPosition="left"
                  iconSize={14}
                  className="flex-1"
                >
                  Reject
                </Button>
              </div>
            )}

            {rec?.status === 'scheduled' && (
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={14} className="text-success" />
                <span className="text-sm text-success font-medium">
                  Scheduled for charging
                </span>
              </div>
            )}

            {rec?.status === 'urgent' && (
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={14} className="text-error" />
                <span className="text-sm text-error font-medium">
                  Immediate charging required
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          fullWidth
          iconName="RefreshCw"
          iconPosition="left"
          iconSize={14}
          onClick={generateRecommendations}
        >
          Refresh Recommendations
        </Button>
      </div>
    </div>
  );
};

export default ChargingRecommendations;