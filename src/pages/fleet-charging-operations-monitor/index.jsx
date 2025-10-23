import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import FleetControlHeader from './components/FleetControlHeader';
import FleetStatusCards from './components/FleetStatusCards';
import ChargingScheduleGantt from './components/ChargingScheduleGantt';
import PriorityControlPanel from './components/PriorityControlPanel';
import VehicleStatusGrid from './components/VehicleStatusGrid';

const FleetChargingOperationsMonitor = () => {
  const [selectedFleet, setSelectedFleet] = useState('fleet-001');
  const [locationFilters, setLocationFilters] = useState({
    active: ['loc-001', 'loc-002'],
    available: [
      { id: 'loc-001', name: 'Downtown Station', stationCount: 12 },
      { id: 'loc-002', name: 'Airport Hub', stationCount: 8 },
      { id: 'loc-003', name: 'Mall Complex', stationCount: 15 },
      { id: 'loc-004', name: 'Industrial Park', stationCount: 6 }
    ]
  });
  const [alertThresholds, setAlertThresholds] = useState({
    batteryLow: 20,
    queueLength: 10,
    gridLoad: 85
  });
  const [emergencyOverride, setEmergencyOverride] = useState({
    active: false,
    timestamp: null
  });

  // Mock data for fleet operations
  const fleetOptions = [
    { id: 'fleet-001', name: 'Corporate Fleet A', vehicleCount: 45 },
    { id: 'fleet-002', name: 'Delivery Fleet B', vehicleCount: 32 },
    { id: 'fleet-003', name: 'Service Fleet C', vehicleCount: 28 }
  ];

  const statusData = {
    currentlyCharging: 18,
    inQueue: 7,
    avgCompletion: '2h 15m',
    activeAlerts: 3
  };

  const scheduleData = [
    {
      id: 'veh-001',
      name: 'EV-001',
      status: 'charging',
      scheduledHours: [8, 9, 10],
      conflicts: []
    },
    {
      id: 'veh-002',
      name: 'EV-002',
      status: 'scheduled',
      scheduledHours: [11, 12, 13],
      conflicts: []
    },
    {
      id: 'veh-003',
      name: 'EV-003',
      status: 'queued',
      scheduledHours: [14, 15],
      conflicts: [14]
    },
    {
      id: 'veh-004',
      name: 'EV-004',
      status: 'charging',
      scheduledHours: [9, 10, 11],
      conflicts: []
    },
    {
      id: 'veh-005',
      name: 'EV-005',
      status: 'scheduled',
      scheduledHours: [16, 17, 18],
      conflicts: []
    }
  ];

  const priorityQueue = [
    {
      id: 'pq-001',
      vehicleId: 'EV-007',
      priority: 'critical',
      batteryLevel: 15,
      estimatedTime: '45m'
    },
    {
      id: 'pq-002',
      vehicleId: 'EV-012',
      priority: 'high',
      batteryLevel: 25,
      estimatedTime: '1h 20m'
    },
    {
      id: 'pq-003',
      vehicleId: 'EV-018',
      priority: 'medium',
      batteryLevel: 35,
      estimatedTime: '2h 10m'
    }
  ];

  const emergencyRequests = [
    {
      id: 'er-001',
      vehicleId: 'EV-023',
      reason: 'Critical delivery route - battery at 8%',
      timestamp: '2 minutes ago'
    },
    {
      id: 'er-002',
      vehicleId: 'EV-031',
      reason: 'Emergency service call required',
      timestamp: '5 minutes ago'
    }
  ];

  const vehicles = [
    {
      id: 'veh-001',
      name: 'EV-001',
      model: 'Tesla Model 3',
      status: 'charging',
      batteryLevel: 65,
      chargingRate: '22.5',
      estimatedCompletion: '1h 45m',
      location: 'Downtown Station',
      stationId: 'CS-001'
    },
    {
      id: 'veh-002',
      name: 'EV-002',
      model: 'Nissan Leaf',
      status: 'scheduled',
      batteryLevel: 45,
      chargingRate: '0',
      estimatedCompletion: '2h 30m',
      location: 'Airport Hub',
      stationId: 'CS-008'
    },
    {
      id: 'veh-003',
      name: 'EV-003',
      model: 'BMW i3',
      status: 'queued',
      batteryLevel: 25,
      chargingRate: '0',
      estimatedCompletion: '3h 15m',
      location: 'Mall Complex',
      stationId: 'CS-015'
    },
    {
      id: 'veh-004',
      name: 'EV-004',
      model: 'Audi e-tron',
      status: 'charging',
      batteryLevel: 80,
      chargingRate: '18.2',
      estimatedCompletion: '45m',
      location: 'Downtown Station',
      stationId: 'CS-003'
    },
    {
      id: 'veh-005',
      name: 'EV-005',
      model: 'Hyundai Kona',
      status: 'completed',
      batteryLevel: 100,
      chargingRate: '0',
      estimatedCompletion: 'Complete',
      location: 'Industrial Park',
      stationId: 'CS-020'
    }
  ];

  // Event handlers
  const handleFleetChange = (fleetId) => {
    setSelectedFleet(fleetId);
  };

  const handleLocationFilterChange = (locationId, checked) => {
    setLocationFilters(prev => ({
      ...prev,
      active: checked 
        ? [...prev?.active, locationId]
        : prev?.active?.filter(id => id !== locationId)
    }));
  };

  const handleAlertThresholdChange = (type, value) => {
    setAlertThresholds(prev => ({
      ...prev,
      [type]: parseInt(value)
    }));
  };

  const handleEmergencyOverride = (active) => {
    setEmergencyOverride({
      active,
      timestamp: active ? new Date()?.toLocaleTimeString() : null
    });
  };

  const handleScheduleUpdate = (vehicleId, newHour) => {
    console.log(`Updating schedule for ${vehicleId} to hour ${newHour}`);
  };

  const handlePriorityUpdate = (itemId, action) => {
    console.log(`Priority update: ${itemId} - ${action}`);
  };

  const handleEmergencyAction = (requestId, action) => {
    console.log(`Emergency action: ${requestId} - ${action}`);
  };

  const handleVehicleUpdate = (vehicleId, action) => {
    console.log(`Vehicle update: ${vehicleId} - ${action}`);
  };

  const handleBulkAction = (action, selectedVehicles) => {
    console.log(`Bulk action: ${action} for vehicles:`, selectedVehicles);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16">
        <FleetControlHeader
          selectedFleet={selectedFleet}
          fleetOptions={fleetOptions}
          onFleetChange={handleFleetChange}
          locationFilters={locationFilters}
          onLocationFilterChange={handleLocationFilterChange}
          alertThresholds={alertThresholds}
          onAlertThresholdChange={handleAlertThresholdChange}
          emergencyOverride={emergencyOverride}
          onEmergencyOverride={handleEmergencyOverride}
        />

        <div className="p-6">
          <FleetStatusCards statusData={statusData} />

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
            <div className="xl:col-span-3">
              <ChargingScheduleGantt
                scheduleData={scheduleData}
                onScheduleUpdate={handleScheduleUpdate}
              />
            </div>
            <div className="xl:col-span-1">
              <PriorityControlPanel
                priorityQueue={priorityQueue}
                emergencyRequests={emergencyRequests}
                onPriorityUpdate={handlePriorityUpdate}
                onEmergencyAction={handleEmergencyAction}
              />
            </div>
          </div>

          <VehicleStatusGrid
            vehicles={vehicles}
            onVehicleUpdate={handleVehicleUpdate}
            onBulkAction={handleBulkAction}
          />
        </div>
      </div>
    </div>
  );
};

export default FleetChargingOperationsMonitor;