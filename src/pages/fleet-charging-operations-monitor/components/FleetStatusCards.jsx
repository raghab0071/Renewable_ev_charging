import React from 'react';
import Icon from '../../../components/AppIcon';

const FleetStatusCards = ({ statusData }) => {
  const statusCards = [
    {
      id: 'charging',
      title: 'Currently Charging',
      value: statusData?.currentlyCharging,
      icon: 'Zap',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20'
    },
    {
      id: 'queue',
      title: 'In Queue',
      value: statusData?.inQueue,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20'
    },
    {
      id: 'completion',
      title: 'Avg. Completion',
      value: statusData?.avgCompletion,
      icon: 'Timer',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
    {
      id: 'alerts',
      title: 'Active Alerts',
      value: statusData?.activeAlerts,
      icon: 'AlertTriangle',
      color: 'text-error',
      bgColor: 'bg-error/10',
      borderColor: 'border-error/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statusCards?.map((card) => (
        <div
          key={card?.id}
          className={`p-4 rounded-lg border ${card?.bgColor} ${card?.borderColor} transition-all duration-200 hover:shadow-md`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-text-secondary mb-1">
                {card?.title}
              </p>
              <p className={`text-2xl font-bold ${card?.color}`}>
                {card?.value}
              </p>
            </div>
            <div className={`p-2 rounded-lg ${card?.bgColor}`}>
              <Icon name={card?.icon} size={24} className={card?.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FleetStatusCards;