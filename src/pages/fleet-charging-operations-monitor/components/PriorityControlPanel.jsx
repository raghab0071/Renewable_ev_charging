import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PriorityControlPanel = ({ priorityQueue, emergencyRequests, onPriorityUpdate, onEmergencyAction }) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e?.preventDefault();
    if (draggedItem && onPriorityUpdate) {
      onPriorityUpdate(draggedItem?.id, targetIndex);
    }
    setDraggedItem(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-error bg-error/10 border-error/20';
      case 'high': return 'text-warning bg-warning/10 border-warning/20';
      case 'medium': return 'text-primary bg-primary/10 border-primary/20';
      case 'low': return 'text-muted-foreground bg-muted/10 border-muted/20';
      default: return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  const quickActions = [
    { id: 'optimize', label: 'Auto Optimize', icon: 'Zap', variant: 'default' },
    { id: 'pause-all', label: 'Pause All', icon: 'Pause', variant: 'outline' },
    { id: 'emergency', label: 'Emergency Stop', icon: 'AlertTriangle', variant: 'destructive' }
  ];

  return (
    <div className="space-y-6">
      {/* Priority Queue */}
      <div className="bg-card rounded-lg border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Priority Queue</h3>
          <span className="text-xs text-text-secondary bg-muted px-2 py-1 rounded">
            {priorityQueue?.length} vehicles
          </span>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {priorityQueue?.map((item, index) => (
            <div
              key={item?.id}
              className={`p-3 rounded-lg border cursor-move transition-all duration-200 hover:shadow-sm ${getPriorityColor(item?.priority)}`}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Icon name="GripVertical" size={16} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-text-primary">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{item?.vehicleId}</p>
                    <p className="text-xs text-text-secondary">{item?.batteryLevel}% • {item?.estimatedTime}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(item?.priority)}`}>
                    {item?.priority}
                  </span>
                  <button
                    onClick={() => onPriorityUpdate && onPriorityUpdate(item?.id, 'remove')}
                    className="p-1 hover:bg-error/10 rounded"
                  >
                    <Icon name="X" size={14} className="text-error" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {priorityQueue?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Clock" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-text-secondary">No vehicles in priority queue</p>
          </div>
        )}
      </div>
      {/* Emergency Requests */}
      <div className="bg-card rounded-lg border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Emergency Requests</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEmergencyForm(true)}
            iconName="Plus"
            iconPosition="left"
            iconSize={16}
          >
            Add Request
          </Button>
        </div>

        <div className="space-y-2">
          {emergencyRequests?.map((request) => (
            <div
              key={request?.id}
              className="p-3 rounded-lg border border-error/20 bg-error/5"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-error" />
                  <span className="text-sm font-medium text-text-primary">{request?.vehicleId}</span>
                </div>
                <span className="text-xs text-text-secondary">{request?.timestamp}</span>
              </div>
              <p className="text-xs text-text-secondary mb-2">{request?.reason}</p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="destructive"
                  size="xs"
                  onClick={() => onEmergencyAction && onEmergencyAction(request?.id, 'approve')}
                >
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => onEmergencyAction && onEmergencyAction(request?.id, 'reject')}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>

        {emergencyRequests?.length === 0 && (
          <div className="text-center py-6">
            <Icon name="Shield" size={28} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-text-secondary">No emergency requests</p>
          </div>
        )}
      </div>
      {/* Quick Actions */}
      <div className="bg-card rounded-lg border p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
        <div className="space-y-2">
          {quickActions?.map((action) => (
            <Button
              key={action?.id}
              variant={action?.variant}
              size="sm"
              fullWidth
              iconName={action?.icon}
              iconPosition="left"
              iconSize={16}
              onClick={() => console.log(`Quick action: ${action?.id}`)}
            >
              {action?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* System Status */}
      <div className="bg-card rounded-lg border p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-4">System Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Grid Connection</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-sm text-success">Online</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Renewable Source</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-sm text-success">Available</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Load Balancer</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-warning" />
              <span className="text-sm text-warning">High Load</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriorityControlPanel;