import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CorrelationHeatmap = ({ filters, selectedTimeRange, onTimeRangeSelect }) => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [brushSelection, setBrushSelection] = useState(null);

  // Generate mock heatmap data
  useEffect(() => {
    const generateHeatmapData = () => {
      const data = [];
      const hours = Array.from({ length: 24 }, (_, i) => i);
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      
      days?.forEach((day, dayIndex) => {
        hours?.forEach((hour) => {
          const renewableAvailability = Math.random() * 100;
          const gridLoad = Math.random() * 100;
          const correlation = (renewableAvailability + (100 - gridLoad)) / 2;
          const optimalCharging = correlation > 60;
          
          data?.push({
            day,
            dayIndex,
            hour,
            renewableAvailability,
            gridLoad,
            correlation,
            optimalCharging,
            weatherImpact: Math.random() * 20,
            confidence: 0.7 + Math.random() * 0.3
          });
        });
      });
      return data;
    };

    setHeatmapData(generateHeatmapData());
  }, [filters]);

  const getCorrelationColor = (correlation) => {
    if (correlation >= 80) return 'bg-success';
    if (correlation >= 60) return 'bg-secondary';
    if (correlation >= 40) return 'bg-warning';
    return 'bg-error';
  };

  const getCorrelationIntensity = (correlation) => {
    const intensity = Math.floor(correlation / 20) * 20;
    return `opacity-${Math.max(20, Math.min(100, intensity))}`;
  };

  const handleCellClick = (cellData) => {
    const startHour = cellData?.hour;
    const endHour = (cellData?.hour + 2) % 24;
    onTimeRangeSelect({
      start: startHour,
      end: endHour,
      day: cellData?.day,
      correlation: cellData?.correlation
    });
  };

  const handleBrushStart = (cellData) => {
    setBrushSelection({
      start: { day: cellData?.dayIndex, hour: cellData?.hour },
      end: { day: cellData?.dayIndex, hour: cellData?.hour }
    });
  };

  const handleBrushMove = (cellData) => {
    if (brushSelection) {
      setBrushSelection({
        ...brushSelection,
        end: { day: cellData?.dayIndex, hour: cellData?.hour }
      });
    }
  };

  const handleBrushEnd = () => {
    if (brushSelection) {
      const selectedCells = heatmapData?.filter(cell => 
        cell?.dayIndex >= Math.min(brushSelection?.start?.day, brushSelection?.end?.day) &&
        cell?.dayIndex <= Math.max(brushSelection?.start?.day, brushSelection?.end?.day) &&
        cell?.hour >= Math.min(brushSelection?.start?.hour, brushSelection?.end?.hour) &&
        cell?.hour <= Math.max(brushSelection?.start?.hour, brushSelection?.end?.hour)
      );
      
      const avgCorrelation = selectedCells?.reduce((sum, cell) => sum + cell?.correlation, 0) / selectedCells?.length;
      
      onTimeRangeSelect({
        start: Math.min(brushSelection?.start?.hour, brushSelection?.end?.hour),
        end: Math.max(brushSelection?.start?.hour, brushSelection?.end?.hour),
        days: selectedCells?.map(cell => cell?.day),
        correlation: avgCorrelation,
        cellCount: selectedCells?.length
      });
    }
    setBrushSelection(null);
  };

  const isCellInBrush = (cellData) => {
    if (!brushSelection) return false;
    return cellData?.dayIndex >= Math.min(brushSelection?.start?.day, brushSelection?.end?.day) &&
           cellData?.dayIndex <= Math.max(brushSelection?.start?.day, brushSelection?.end?.day) &&
           cellData?.hour >= Math.min(brushSelection?.start?.hour, brushSelection?.end?.hour) &&
           cellData?.hour <= Math.max(brushSelection?.start?.hour, brushSelection?.end?.hour);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary flex items-center">
            <Icon name="Grid3X3" size={20} className="mr-2" />
            Renewable vs Grid Load Correlation
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            24-hour correlation heatmap showing optimal charging opportunities
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-success rounded"></div>
              <span className="text-text-secondary">Optimal (80%+)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-secondary rounded"></div>
              <span className="text-text-secondary">Good (60-79%)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-warning rounded"></div>
              <span className="text-text-secondary">Fair (40-59%)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-error rounded"></div>
              <span className="text-text-secondary">Poor (&lt;40%)</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            iconSize={16}
          >
            Export
          </Button>
        </div>
      </div>
      <div className="relative overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Hour labels */}
          <div className="flex mb-2">
            <div className="w-16"></div>
            {Array.from({ length: 24 }, (_, i) => (
              <div key={i} className="flex-1 text-center text-xs text-text-secondary font-mono">
                {i?.toString()?.padStart(2, '0')}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="space-y-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']?.map((day, dayIndex) => (
              <div key={day} className="flex items-center">
                <div className="w-16 text-sm text-text-secondary font-medium text-right pr-3">
                  {day}
                </div>
                <div className="flex flex-1 space-x-1">
                  {Array.from({ length: 24 }, (_, hour) => {
                    const cellData = heatmapData?.find(d => d?.day === day && d?.hour === hour);
                    if (!cellData) return null;

                    return (
                      <div
                        key={`${day}-${hour}`}
                        className={`
                          flex-1 h-8 rounded cursor-pointer transition-all duration-200 relative
                          ${getCorrelationColor(cellData?.correlation)} ${getCorrelationIntensity(cellData?.correlation)}
                          ${isCellInBrush(cellData) ? 'ring-2 ring-primary' : ''}
                          hover:ring-2 hover:ring-primary/50 hover:scale-105
                        `}
                        onClick={() => handleCellClick(cellData)}
                        onMouseDown={() => handleBrushStart(cellData)}
                        onMouseMove={() => handleBrushMove(cellData)}
                        onMouseUp={handleBrushEnd}
                        onMouseEnter={() => setHoveredCell(cellData)}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        {cellData?.optimalCharging && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Icon name="Zap" size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Hover tooltip */}
      {hoveredCell && (
        <div className="absolute z-10 bg-popover border border-border rounded-lg p-3 shadow-lg pointer-events-none">
          <div className="text-sm font-medium text-text-primary mb-2">
            {hoveredCell?.day} {hoveredCell?.hour?.toString()?.padStart(2, '0')}:00
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-text-secondary">Correlation:</span>
              <span className="text-text-primary font-medium">{hoveredCell?.correlation?.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Renewable:</span>
              <span className="text-secondary font-medium">{hoveredCell?.renewableAvailability?.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Grid Load:</span>
              <span className="text-primary font-medium">{hoveredCell?.gridLoad?.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Confidence:</span>
              <span className="text-text-primary font-medium">{(hoveredCell?.confidence * 100)?.toFixed(0)}%</span>
            </div>
            {hoveredCell?.optimalCharging && (
              <div className="text-success text-xs font-medium mt-2">
                ⚡ Optimal Charging Window
              </div>
            )}
          </div>
        </div>
      )}
      {/* Selection info */}
      {selectedTimeRange && (
        <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium text-text-primary">Selected: </span>
              <span className="text-text-secondary">
                {selectedTimeRange?.days ? 
                  `${selectedTimeRange?.days?.length} days, ${selectedTimeRange?.start}:00-${selectedTimeRange?.end}:00` :
                  `${selectedTimeRange?.day} ${selectedTimeRange?.start}:00-${selectedTimeRange?.end}:00`
                }
              </span>
              <span className="ml-2 text-primary font-medium">
                ({selectedTimeRange?.correlation?.toFixed(1)}% correlation)
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTimeRangeSelect(null)}
              iconName="X"
              iconSize={16}
            >
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorrelationHeatmap;