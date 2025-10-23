import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VehicleStatusGrid = ({ vehicles, onVehicleUpdate, onBulkAction }) => {
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingVehicle, setEditingVehicle] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'charging': return 'text-success bg-success/10';
      case 'scheduled': return 'text-primary bg-primary/10';
      case 'queued': return 'text-warning bg-warning/10';
      case 'completed': return 'text-muted-foreground bg-muted/10';
      case 'error': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const getBatteryColor = (level) => {
    if (level >= 80) return 'text-success';
    if (level >= 50) return 'text-warning';
    if (level >= 20) return 'text-primary';
    return 'text-error';
  };

  const handleSelectVehicle = (vehicleId) => {
    setSelectedVehicles(prev => 
      prev?.includes(vehicleId) 
        ? prev?.filter(id => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  const handleSelectAll = () => {
    setSelectedVehicles(
      selectedVehicles?.length === vehicles?.length 
        ? [] 
        : vehicles?.map(v => v?.id)
    );
  };

  const filteredVehicles = vehicles?.filter(vehicle => filterStatus === 'all' || vehicle?.status === filterStatus)?.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a?.name?.localeCompare(b?.name);
        case 'battery': return b?.batteryLevel - a?.batteryLevel;
        case 'status': return a?.status?.localeCompare(b?.status);
        case 'completion': return a?.estimatedCompletion - b?.estimatedCompletion;
        default: return 0;
      }
    });

  const bulkActions = [
    { id: 'pause', label: 'Pause Selected', icon: 'Pause', variant: 'outline' },
    { id: 'resume', label: 'Resume Selected', icon: 'Play', variant: 'default' },
    { id: 'priority', label: 'Set Priority', icon: 'ArrowUp', variant: 'secondary' },
    { id: 'reschedule', label: 'Reschedule', icon: 'Calendar', variant: 'outline' }
  ];

  return (
    <div className="bg-card rounded-lg border">
      {/* Header Controls */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Vehicle Status Grid</h3>
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="px-3 py-1 text-sm border border-border rounded-md bg-background text-text-primary"
            >
              <option value="name">Sort by Name</option>
              <option value="battery">Sort by Battery</option>
              <option value="status">Sort by Status</option>
              <option value="completion">Sort by Completion</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e?.target?.value)}
              className="px-3 py-1 text-sm border border-border rounded-md bg-background text-text-primary"
            >
              <option value="all">All Status</option>
              <option value="charging">Charging</option>
              <option value="scheduled">Scheduled</option>
              <option value="queued">Queued</option>
              <option value="completed">Completed</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedVehicles?.length > 0 && (
          <div className="flex items-center space-x-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <span className="text-sm font-medium text-text-primary">
              {selectedVehicles?.length} selected
            </span>
            <div className="flex items-center space-x-2 ml-4">
              {bulkActions?.map((action) => (
                <Button
                  key={action?.id}
                  variant={action?.variant}
                  size="xs"
                  iconName={action?.icon}
                  iconPosition="left"
                  iconSize={14}
                  onClick={() => onBulkAction && onBulkAction(action?.id, selectedVehicles)}
                >
                  {action?.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Vehicle Grid */}
      <div className="p-4">
        {/* Grid Header */}
        <div className="grid grid-cols-12 gap-4 p-3 bg-muted/30 rounded-lg mb-2 text-sm font-medium text-text-secondary">
          <div className="col-span-1 flex items-center">
            <input
              type="checkbox"
              checked={selectedVehicles?.length === vehicles?.length}
              onChange={handleSelectAll}
              className="rounded border-border"
            />
          </div>
          <div className="col-span-2">Vehicle</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Battery</div>
          <div className="col-span-2">Charging Rate</div>
          <div className="col-span-2">Completion</div>
          <div className="col-span-2">Location</div>
          <div className="col-span-1">Actions</div>
        </div>

        {/* Vehicle Rows */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredVehicles?.map((vehicle) => (
            <div
              key={vehicle?.id}
              className={`grid grid-cols-12 gap-4 p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${
                selectedVehicles?.includes(vehicle?.id) ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'
              }`}
            >
              <div className="col-span-1 flex items-center">
                <input
                  type="checkbox"
                  checked={selectedVehicles?.includes(vehicle?.id)}
                  onChange={() => handleSelectVehicle(vehicle?.id)}
                  className="rounded border-border"
                />
              </div>
              
              <div className="col-span-2 flex items-center space-x-2">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                  <Icon name="Car" size={16} className="text-text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{vehicle?.name}</p>
                  <p className="text-xs text-text-secondary">{vehicle?.model}</p>
                </div>
              </div>
              
              <div className="col-span-1 flex items-center">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(vehicle?.status)}`}>
                  {vehicle?.status}
                </span>
              </div>
              
              <div className="col-span-1 flex items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        vehicle?.batteryLevel >= 80 ? 'bg-success' :
                        vehicle?.batteryLevel >= 50 ? 'bg-warning' :
                        vehicle?.batteryLevel >= 20 ? 'bg-primary' : 'bg-error'
                      }`}
                      style={{ width: `${vehicle?.batteryLevel}%` }}
                    />
                  </div>
                  <span className={`text-sm font-medium ${getBatteryColor(vehicle?.batteryLevel)}`}>
                    {vehicle?.batteryLevel}%
                  </span>
                </div>
              </div>
              
              <div className="col-span-2 flex items-center">
                <div>
                  <p className="text-sm font-medium text-text-primary">{vehicle?.chargingRate}</p>
                  <p className="text-xs text-text-secondary">kW</p>
                </div>
              </div>
              
              <div className="col-span-2 flex items-center">
                <div>
                  <p className="text-sm font-medium text-text-primary">{vehicle?.estimatedCompletion}</p>
                  <p className="text-xs text-text-secondary">remaining</p>
                </div>
              </div>
              
              <div className="col-span-2 flex items-center">
                <div>
                  <p className="text-sm font-medium text-text-primary">{vehicle?.location}</p>
                  <p className="text-xs text-text-secondary">Station {vehicle?.stationId}</p>
                </div>
              </div>
              
              <div className="col-span-1 flex items-center space-x-1">
                <button
                  onClick={() => setEditingVehicle(vehicle?.id)}
                  className="p-1 hover:bg-muted rounded"
                  title="Edit vehicle settings"
                >
                  <Icon name="Settings" size={14} className="text-text-secondary" />
                </button>
                <button
                  onClick={() => onVehicleUpdate && onVehicleUpdate(vehicle?.id, 'pause')}
                  className="p-1 hover:bg-muted rounded"
                  title="Pause charging"
                >
                  <Icon name="Pause" size={14} className="text-text-secondary" />
                </button>
                <button
                  onClick={() => onVehicleUpdate && onVehicleUpdate(vehicle?.id, 'priority')}
                  className="p-1 hover:bg-muted rounded"
                  title="Set priority"
                >
                  <Icon name="ArrowUp" size={14} className="text-text-secondary" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredVehicles?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Car" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-text-primary mb-2">No vehicles found</p>
            <p className="text-sm text-text-secondary">
              {filterStatus !== 'all' ? `No vehicles with status "${filterStatus}"` : 'No vehicles in the fleet'}
            </p>
          </div>
        )}
      </div>
      {/* Summary Footer */}
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-text-primary">{vehicles?.length}</p>
            <p className="text-xs text-text-secondary">Total Vehicles</p>
          </div>
          <div>
            <p className="text-lg font-bold text-success">
              {vehicles?.filter(v => v?.status === 'charging')?.length}
            </p>
            <p className="text-xs text-text-secondary">Currently Charging</p>
          </div>
          <div>
            <p className="text-lg font-bold text-warning">
              {vehicles?.filter(v => v?.status === 'queued')?.length}
            </p>
            <p className="text-xs text-text-secondary">In Queue</p>
          </div>
          <div>
            <p className="text-lg font-bold text-primary">
              {Math.round(vehicles?.reduce((acc, v) => acc + v?.batteryLevel, 0) / vehicles?.length)}%
            </p>
            <p className="text-xs text-text-secondary">Avg Battery</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleStatusGrid;