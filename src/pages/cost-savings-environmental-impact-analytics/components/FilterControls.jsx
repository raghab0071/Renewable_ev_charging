import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const FilterControls = ({ 
  onDateRangeChange, 
  onComparisonModeChange, 
  onSegmentationChange,
  onExport,
  onBookmark 
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('thisMonth');
  const [comparisonMode, setComparisonMode] = useState('monthOverMonth');
  const [selectedSegment, setSelectedSegment] = useState('all');

  const dateRangeOptions = [
    { value: 'thisWeek', label: 'This Week' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'thisQuarter', label: 'This Quarter' },
    { value: 'thisYear', label: 'This Year' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'lastQuarter', label: 'Last Quarter' },
    { value: 'lastYear', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const comparisonModeOptions = [
    { value: 'monthOverMonth', label: 'Month-over-Month' },
    { value: 'yearOverYear', label: 'Year-over-Year' },
    { value: 'quarterOverQuarter', label: 'Quarter-over-Quarter' },
    { value: 'weekOverWeek', label: 'Week-over-Week' }
  ];

  const segmentationOptions = [
    { value: 'all', label: 'All Vehicles' },
    { value: 'fleet', label: 'By Fleet' },
    { value: 'department', label: 'By Department' },
    { value: 'vehicleType', label: 'By Vehicle Type' },
    { value: 'location', label: 'By Location' }
  ];

  const handleDateRangeChange = (value) => {
    setSelectedDateRange(value);
    onDateRangeChange(value);
  };

  const handleComparisonModeChange = (value) => {
    setComparisonMode(value);
    onComparisonModeChange(value);
  };

  const handleSegmentationChange = (value) => {
    setSelectedSegment(value);
    onSegmentationChange(value);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left Side - Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Date Range Picker */}
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-text-secondary" />
            <Select
              options={dateRangeOptions}
              value={selectedDateRange}
              onChange={handleDateRangeChange}
              placeholder="Select date range"
              className="min-w-[150px]"
            />
          </div>

          {/* Comparison Mode */}
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={16} className="text-text-secondary" />
            <Select
              options={comparisonModeOptions}
              value={comparisonMode}
              onChange={handleComparisonModeChange}
              placeholder="Comparison mode"
              className="min-w-[180px]"
            />
          </div>

          {/* Segmentation Filter */}
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={16} className="text-text-secondary" />
            <Select
              options={segmentationOptions}
              value={selectedSegment}
              onChange={handleSegmentationChange}
              placeholder="Segment by"
              className="min-w-[150px]"
            />
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-3">
          {/* Bookmark Current View */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onBookmark}
            iconName="Bookmark"
            iconPosition="left"
            iconSize={16}
          >
            Bookmark
          </Button>

          {/* Export Options */}
          <div className="relative group">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              iconSize={16}
            >
              Export
            </Button>
            
            {/* Export Dropdown */}
            <div className="absolute top-full right-0 mt-1 w-48 bg-surface border border-border rounded-lg shadow-modal opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-2">
                <button
                  onClick={() => onExport('pdf')}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-muted rounded-md transition-colors duration-200"
                >
                  <Icon name="FileText" size={16} />
                  <span>PDF Report</span>
                </button>
                <button
                  onClick={() => onExport('excel')}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-muted rounded-md transition-colors duration-200"
                >
                  <Icon name="FileSpreadsheet" size={16} />
                  <span>Excel Data</span>
                </button>
                <button
                  onClick={() => onExport('powerpoint')}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-muted rounded-md transition-colors duration-200"
                >
                  <Icon name="Presentation" size={16} />
                  <span>PowerPoint</span>
                </button>
                <button
                  onClick={() => onExport('csv')}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-muted rounded-md transition-colors duration-200"
                >
                  <Icon name="Database" size={16} />
                  <span>CSV Data</span>
                </button>
              </div>
            </div>
          </div>

          {/* Refresh Data */}
          <Button
            variant="ghost"
            size="sm"
            iconName="RefreshCw"
            iconSize={16}
          >
          </Button>
        </div>
      </div>

      {/* Last Updated Timestamp */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={12} />
            <span>Last updated: September 20, 2025 at 4:06 AM</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span>Auto-refresh every 30 minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;