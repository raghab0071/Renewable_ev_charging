import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ filters, onFiltersChange, onSaveFilter, savedFilters, onLoadFilter }) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');

  const weatherOptions = [
    { value: 'all', label: 'All Weather' },
    { value: 'sunny', label: 'Sunny' },
    { value: 'cloudy', label: 'Cloudy' },
    { value: 'windy', label: 'Windy' },
    { value: 'rainy', label: 'Rainy' }
  ];

  const renewableSourceOptions = [
    { value: 'all', label: 'All Sources' },
    { value: 'solar', label: 'Solar Only' },
    { value: 'wind', label: 'Wind Only' },
    { value: 'hydro', label: 'Hydro Only' },
    { value: 'mixed', label: 'Mixed Sources' }
  ];

  const regionOptions = [
    { value: 'all', label: 'All Regions' },
    { value: 'north', label: 'North Grid' },
    { value: 'south', label: 'South Grid' },
    { value: 'east', label: 'East Grid' },
    { value: 'west', label: 'West Grid' }
  ];

  const seasonOptions = [
    { value: 'all', label: 'All Seasons' },
    { value: 'spring', label: 'Spring' },
    { value: 'summer', label: 'Summer' },
    { value: 'fall', label: 'Fall' },
    { value: 'winter', label: 'Winter' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleSaveFilter = () => {
    if (filterName?.trim()) {
      onSaveFilter(filterName, filters);
      setFilterName('');
      setShowSaveDialog(false);
    }
  };

  const resetFilters = () => {
    onFiltersChange({
      weather: 'all',
      renewableSource: 'all',
      region: 'all',
      season: 'all',
      includeWeekends: true,
      includePeakHours: true,
      showConfidenceIntervals: true
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary flex items-center">
          <Icon name="Filter" size={20} className="mr-2" />
          Analysis Filters
        </h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSaveDialog(true)}
            iconName="Save"
            iconPosition="left"
            iconSize={16}
          >
            Save
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            iconName="RotateCcw"
            iconPosition="left"
            iconSize={16}
          >
            Reset
          </Button>
        </div>
      </div>
      <div className="space-y-6">
        {/* Weather Conditions */}
        <div>
          <Select
            label="Weather Conditions"
            options={weatherOptions}
            value={filters?.weather}
            onChange={(value) => handleFilterChange('weather', value)}
            className="mb-4"
          />
        </div>

        {/* Renewable Source Types */}
        <div>
          <Select
            label="Renewable Source"
            options={renewableSourceOptions}
            value={filters?.renewableSource}
            onChange={(value) => handleFilterChange('renewableSource', value)}
            className="mb-4"
          />
        </div>

        {/* Grid Regions */}
        <div>
          <Select
            label="Grid Region"
            options={regionOptions}
            value={filters?.region}
            onChange={(value) => handleFilterChange('region', value)}
            className="mb-4"
          />
        </div>

        {/* Seasonal Patterns */}
        <div>
          <Select
            label="Seasonal Pattern"
            options={seasonOptions}
            value={filters?.season}
            onChange={(value) => handleFilterChange('season', value)}
            className="mb-4"
          />
        </div>

        {/* Additional Options */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-text-primary">Additional Options</h4>
          
          <Checkbox
            label="Include Weekends"
            checked={filters?.includeWeekends}
            onChange={(e) => handleFilterChange('includeWeekends', e?.target?.checked)}
          />
          
          <Checkbox
            label="Include Peak Hours"
            checked={filters?.includePeakHours}
            onChange={(e) => handleFilterChange('includePeakHours', e?.target?.checked)}
          />
          
          <Checkbox
            label="Show Confidence Intervals"
            checked={filters?.showConfidenceIntervals}
            onChange={(e) => handleFilterChange('showConfidenceIntervals', e?.target?.checked)}
          />
        </div>

        {/* Saved Filters */}
        {savedFilters?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-3">Saved Filter Sets</h4>
            <div className="space-y-2">
              {savedFilters?.map((saved, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <span className="text-sm text-text-secondary">{saved?.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onLoadFilter(saved?.filters)}
                    iconName="Download"
                    iconSize={14}
                  >
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Save Filter Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-card border border-border rounded-lg p-6 w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Save Filter Set</h3>
            <input
              type="text"
              placeholder="Enter filter name..."
              value={filterName}
              onChange={(e) => setFilterName(e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSaveDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSaveFilter}
                disabled={!filterName?.trim()}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;