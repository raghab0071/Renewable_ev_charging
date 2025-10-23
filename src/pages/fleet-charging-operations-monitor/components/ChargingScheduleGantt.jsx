import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ChargingScheduleGantt = ({ scheduleData, onScheduleUpdate }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i?.toString()?.padStart(2, '0');
    return `${hour}:00`;
  });

  const renewableAvailability = [
    { hour: 0, percentage: 15 }, { hour: 1, percentage: 12 }, { hour: 2, percentage: 10 },
    { hour: 3, percentage: 8 }, { hour: 4, percentage: 6 }, { hour: 5, percentage: 10 },
    { hour: 6, percentage: 25 }, { hour: 7, percentage: 45 }, { hour: 8, percentage: 65 },
    { hour: 9, percentage: 80 }, { hour: 10, percentage: 90 }, { hour: 11, percentage: 95 },
    { hour: 12, percentage: 100 }, { hour: 13, percentage: 95 }, { hour: 14, percentage: 85 },
    { hour: 15, percentage: 75 }, { hour: 16, percentage: 60 }, { hour: 17, percentage: 40 },
    { hour: 18, percentage: 25 }, { hour: 19, percentage: 15 }, { hour: 20, percentage: 12 },
    { hour: 21, percentage: 10 }, { hour: 22, percentage: 8 }, { hour: 23, percentage: 12 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'charging': return 'bg-success text-success-foreground';
      case 'scheduled': return 'bg-primary text-primary-foreground';
      case 'queued': return 'bg-warning text-warning-foreground';
      case 'completed': return 'bg-muted text-muted-foreground';
      case 'conflict': return 'bg-error text-error-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleDragStart = (e, vehicle) => {
    setDraggedItem(vehicle);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetHour) => {
    e?.preventDefault();
    if (draggedItem && onScheduleUpdate) {
      onScheduleUpdate(draggedItem?.id, targetHour);
    }
    setDraggedItem(null);
  };

  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Charging Schedule</h3>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 text-xs bg-success/10 text-success rounded-md border border-success/20">
            Auto-Optimize
          </button>
          <button className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-md border border-primary/20">
            Bulk Edit
          </button>
        </div>
      </div>
      {/* Renewable Energy Overlay */}
      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">Renewable Energy Availability</span>
          <span className="text-xs text-text-secondary">Higher bars = more renewable energy</span>
        </div>
        <div className="flex items-end space-x-1 h-8">
          {renewableAvailability?.map((slot) => (
            <div
              key={slot?.hour}
              className="flex-1 bg-secondary rounded-sm"
              style={{ height: `${slot?.percentage}%` }}
              title={`${slot?.hour}:00 - ${slot?.percentage}% renewable`}
            />
          ))}
        </div>
      </div>
      {/* Time Header */}
      <div className="grid grid-cols-25 gap-1 mb-2">
        <div className="col-span-1 text-xs font-medium text-text-secondary p-2">
          Vehicle
        </div>
        {timeSlots?.map((time) => (
          <div key={time} className="text-xs text-text-secondary text-center p-1">
            {time}
          </div>
        ))}
      </div>
      {/* Schedule Grid */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {scheduleData?.map((vehicle) => (
          <div
            key={vehicle?.id}
            className={`grid grid-cols-25 gap-1 p-2 rounded-lg border transition-all duration-200 ${
              selectedVehicle === vehicle?.id ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'
            }`}
            onClick={() => setSelectedVehicle(vehicle?.id)}
          >
            <div className="col-span-1 flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(vehicle?.status)?.split(' ')?.[0]}`} />
              <span className="text-sm font-medium text-text-primary truncate">
                {vehicle?.name}
              </span>
            </div>
            
            {timeSlots?.map((_, hourIndex) => {
              const isScheduled = vehicle?.scheduledHours?.includes(hourIndex);
              const hasConflict = vehicle?.conflicts && vehicle?.conflicts?.includes(hourIndex);
              
              return (
                <div
                  key={hourIndex}
                  className={`h-8 rounded border transition-all duration-200 cursor-pointer ${
                    hasConflict
                      ? 'bg-error/20 border-error/40'
                      : isScheduled
                      ? getStatusColor(vehicle?.status)
                      : 'bg-muted/30 border-border hover:bg-muted/50'
                  }`}
                  draggable={isScheduled}
                  onDragStart={(e) => handleDragStart(e, vehicle)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, hourIndex)}
                  title={
                    hasConflict
                      ? 'Scheduling conflict detected'
                      : isScheduled
                      ? `${vehicle?.name} - ${vehicle?.status}`
                      : 'Available slot'
                  }
                >
                  {isScheduled && (
                    <div className="flex items-center justify-center h-full">
                      <Icon 
                        name={vehicle?.status === 'charging' ? 'Zap' : 'Clock'} 
                        size={12} 
                        className="opacity-80"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-success" />
          <span className="text-xs text-text-secondary">Charging</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-primary" />
          <span className="text-xs text-text-secondary">Scheduled</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-warning" />
          <span className="text-xs text-text-secondary">Queued</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-error" />
          <span className="text-xs text-text-secondary">Conflict</span>
        </div>
      </div>
    </div>
  );
};

export default ChargingScheduleGantt;