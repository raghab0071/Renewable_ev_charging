import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [alertCount, setAlertCount] = useState(3);
  const [timeRange, setTimeRange] = useState('24h');
  const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false);
  const [showAlertPanel, setShowAlertPanel] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const navigationItems = [
    {
      label: 'Live Operations',
      items: [
        {
          path: '/real-time-energy-optimization-dashboard',
          label: 'Real-Time Dashboard',
          icon: 'Activity'
        },
        {
          path: '/fleet-charging-operations-monitor',
          label: 'Fleet Operations',
          icon: 'Truck'
        }
      ]
    },
    {
      label: 'Analytics',
      items: [
        {
          path: '/cost-savings-environmental-impact-analytics',
          label: 'Cost & Impact Analytics',
          icon: 'TrendingUp'
        },
        {
          path: '/grid-load-renewable-energy-correlation-analysis',
          label: 'Grid Correlation Analysis',
          icon: 'BarChart3'
        }
      ]
    }
  ];

  const timeRangeOptions = [
    { value: '15m', label: '15 Minutes' },
    { value: '1h', label: '1 Hour' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '1y', label: '1 Year' }
  ];

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getActiveSection = () => {
    const currentPath = location?.pathname;
    for (const section of navigationItems) {
      if (section?.items?.some(item => item?.path === currentPath)) {
        return section?.label;
      }
    }
    return null;
  };

  const getActiveItem = () => {
    const currentPath = location?.pathname;
    for (const section of navigationItems) {
      const activeItem = section?.items?.find(item => item?.path === currentPath);
      if (activeItem) return activeItem;
    }
    return null;
  };

  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
    setShowTimeRangeDropdown(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-1000 bg-surface border-b border-border">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Zap" size={20} color="white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-text-primary">EV Smart</span>
                <span className="text-xs text-text-secondary -mt-1">Charging Dashboard</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems?.map((section) => (
                <div key={section?.label} className="relative group">
                  <button className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    getActiveSection() === section?.label 
                      ? 'text-primary bg-primary/10' :'text-text-secondary hover:text-text-primary hover:bg-muted'
                  }`}>
                    <span>{section?.label}</span>
                    <Icon name="ChevronDown" size={16} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 mt-1 w-64 bg-surface border border-border rounded-lg shadow-modal opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-2">
                      {section?.items?.map((item) => (
                        <a
                          key={item?.path}
                          href={item?.path}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                            location?.pathname === item?.path
                              ? 'text-primary bg-primary/10' :'text-text-secondary hover:text-text-primary hover:bg-muted'
                          }`}
                        >
                          <Icon name={item?.icon} size={16} />
                          <span>{item?.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </nav>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            {/* Global Status Indicator */}
            <div className="hidden lg:flex items-center space-x-3 px-3 py-2 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-success' : 
                  connectionStatus === 'warning' ? 'bg-warning' : 'bg-error'
                }`} />
                <span className={`text-xs font-medium ${getConnectionStatusColor()}`}>
                  {connectionStatus === 'connected' ? 'Live' : 
                   connectionStatus === 'warning' ? 'Delayed' : 'Offline'}
                </span>
              </div>
              <div className="text-xs text-text-secondary font-mono">
                {currentTime?.toLocaleTimeString()}
              </div>
            </div>

            {/* Time Range Controller */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTimeRangeDropdown(!showTimeRangeDropdown)}
                iconName="Clock"
                iconPosition="left"
                iconSize={16}
              >
                {timeRangeOptions?.find(opt => opt?.value === timeRange)?.label}
              </Button>
              
              {showTimeRangeDropdown && (
                <div className="absolute top-full right-0 mt-1 w-40 bg-surface border border-border rounded-lg shadow-modal z-1100">
                  <div className="p-1">
                    {timeRangeOptions?.map((option) => (
                      <button
                        key={option?.value}
                        onClick={() => handleTimeRangeChange(option?.value)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                          timeRange === option?.value
                            ? 'text-primary bg-primary/10' :'text-text-secondary hover:text-text-primary hover:bg-muted'
                        }`}
                      >
                        {option?.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Alert Management */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAlertPanel(!showAlertPanel)}
              iconName="Bell"
              iconPosition="left"
              iconSize={16}
              className="relative"
            >
              Alerts
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center">
                  {alertCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              iconName="Menu"
              iconSize={20}
            >
            </Button>
          </div>
        </div>
      </header>
      {/* Alert Panel Overlay */}
      {showAlertPanel && (
        <div className="fixed inset-0 z-1200 bg-black/50" onClick={() => setShowAlertPanel(false)}>
          <div 
            className="fixed top-16 right-6 w-96 max-w-[calc(100vw-3rem)] bg-surface border border-border rounded-lg shadow-modal"
            onClick={(e) => e?.stopPropagation()}
          >
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">System Alerts</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAlertPanel(false)}
                  iconName="X"
                  iconSize={16}
                />
              </div>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              <div className="flex items-start space-x-3 p-3 bg-warning/10 border-l-4 border-warning rounded-md">
                <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">High Grid Load Detected</p>
                  <p className="text-xs text-text-secondary mt-1">Peak demand exceeding 85% capacity</p>
                  <p className="text-xs text-text-secondary font-mono mt-1">2 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-error/10 border-l-4 border-error rounded-md">
                <Icon name="AlertCircle" size={16} className="text-error mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">Charging Station Offline</p>
                  <p className="text-xs text-text-secondary mt-1">Station CS-001 connection lost</p>
                  <p className="text-xs text-text-secondary font-mono mt-1">5 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-success/10 border-l-4 border-success rounded-md">
                <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">Optimization Complete</p>
                  <p className="text-xs text-text-secondary mt-1">Energy distribution optimized for next 4 hours</p>
                  <p className="text-xs text-text-secondary font-mono mt-1">8 minutes ago</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-border">
              <Button variant="outline" size="sm" fullWidth>
                View All Alerts
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Click outside handler for time range dropdown */}
      {showTimeRangeDropdown && (
        <div 
          className="fixed inset-0 z-1000" 
          onClick={() => setShowTimeRangeDropdown(false)}
        />
      )}
    </>
  );
};

export default Header;