import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const DataTable = ({ filters, selectedTimeRange }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'time', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([
    'time', 'renewableAvailability', 'gridLoad', 'correlation', 'optimalCharging'
  ]);

  // Generate mock granular data
  const rawData = useMemo(() => {
    const data = [];
    const startDate = new Date();
    startDate?.setHours(0, 0, 0, 0);

    for (let i = 0; i < 168; i++) { // 7 days of hourly data
      const currentTime = new Date(startDate.getTime() + i * 60 * 60 * 1000);
      const hour = currentTime?.getHours();
      const dayOfWeek = currentTime?.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // Generate realistic patterns
      const solarPattern = Math.max(0, Math.sin((hour - 6) * Math.PI / 12)) * (Math.random() * 0.3 + 0.7);
      const windPattern = 0.3 + Math.random() * 0.7;
      const gridLoadPattern = isWeekend ? 
        0.4 + 0.3 * Math.sin((hour - 2) * Math.PI / 12) :
        0.5 + 0.4 * Math.sin((hour - 4) * Math.PI / 12);

      const renewableAvailability = (solarPattern + windPattern) * 50;
      const gridLoad = gridLoadPattern * 100 + (Math.random() - 0.5) * 20;
      const correlation = (renewableAvailability + (100 - gridLoad)) / 2;
      const optimalCharging = correlation > 60;

      data?.push({
        id: i,
        time: currentTime?.toISOString(),
        timeFormatted: currentTime?.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        renewableAvailability: renewableAvailability,
        solarGeneration: solarPattern * 100,
        windGeneration: windPattern * 100,
        gridLoad: Math.max(20, Math.min(100, gridLoad)),
        correlation: correlation,
        optimalCharging: optimalCharging,
        weatherCondition: ['Sunny', 'Cloudy', 'Windy', 'Clear']?.[Math.floor(Math.random() * 4)],
        confidence: 0.7 + Math.random() * 0.3,
        costSavings: optimalCharging ? (Math.random() * 15 + 5) : 0,
        co2Reduction: optimalCharging ? (Math.random() * 8 + 2) : 0,
        gridStability: 0.8 + Math.random() * 0.2,
        region: ['North', 'South', 'East', 'West']?.[Math.floor(Math.random() * 4)]
      });
    }
    return data;
  }, []);

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = rawData;

    // Apply filters
    if (filters?.weather !== 'all') {
      filtered = filtered?.filter(item => 
        item?.weatherCondition?.toLowerCase() === filters?.weather?.toLowerCase()
      );
    }

    if (filters?.region !== 'all') {
      filtered = filtered?.filter(item => 
        item?.region?.toLowerCase() === filters?.region?.toLowerCase()
      );
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered?.filter(item =>
        Object.values(item)?.some(value =>
          value?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase())
        )
      );
    }

    return filtered;
  }, [rawData, filters, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig?.key) return filteredData;

    return [...filteredData]?.sort((a, b) => {
      const aValue = a?.[sortConfig?.key];
      const bValue = b?.[sortConfig?.key];

      if (aValue < bValue) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData?.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData?.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleExportCSV = () => {
    const headers = columns?.filter(col => selectedColumns?.includes(col?.key))?.map(col => col?.label);
    const csvContent = [
      headers?.join(','),
      ...sortedData?.map(row => 
        columns?.filter(col => selectedColumns?.includes(col?.key))?.map(col => {
            const value = row?.[col?.key];
            if (typeof value === 'number') {
              return value?.toFixed(2);
            }
            return `"${value}"`;
          })?.join(',')
      )
    ]?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `correlation-analysis-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  const columns = [
    { key: 'timeFormatted', label: 'Time', sortable: true },
    { key: 'renewableAvailability', label: 'Renewable %', sortable: true },
    { key: 'solarGeneration', label: 'Solar %', sortable: true },
    { key: 'windGeneration', label: 'Wind %', sortable: true },
    { key: 'gridLoad', label: 'Grid Load %', sortable: true },
    { key: 'correlation', label: 'Correlation', sortable: true },
    { key: 'optimalCharging', label: 'Optimal', sortable: true },
    { key: 'weatherCondition', label: 'Weather', sortable: true },
    { key: 'confidence', label: 'Confidence', sortable: true },
    { key: 'costSavings', label: 'Cost Savings $', sortable: true },
    { key: 'co2Reduction', label: 'CO₂ Reduction kg', sortable: true },
    { key: 'gridStability', label: 'Grid Stability', sortable: true },
    { key: 'region', label: 'Region', sortable: true }
  ];

  const itemsPerPageOptions = [
    { value: 10, label: '10 per page' },
    { value: 25, label: '25 per page' },
    { value: 50, label: '50 per page' },
    { value: 100, label: '100 per page' }
  ];

  const columnOptions = columns?.map(col => ({
    value: col?.key,
    label: col?.label
  }));

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary flex items-center">
            <Icon name="Table" size={20} className="mr-2" />
            Granular Data Analysis
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            Hourly correlation data with sorting and filtering capabilities
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            iconName="Download"
            iconPosition="left"
            iconSize={16}
          >
            Export CSV
          </Button>
        </div>
      </div>
      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          <Select
            options={itemsPerPageOptions}
            value={itemsPerPage}
            onChange={setItemsPerPage}
            className="w-40"
          />
        </div>

        <div className="flex items-center space-x-4">
          <Select
            options={columnOptions}
            value={selectedColumns}
            onChange={setSelectedColumns}
            multiple
            placeholder="Select columns..."
            className="w-48"
          />
          <div className="text-sm text-text-secondary">
            {sortedData?.length} records
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {columns?.filter(col => selectedColumns?.includes(col?.key))?.map(column => (
                <th
                  key={column?.key}
                  className={`text-left py-3 px-4 font-medium text-text-primary ${
                    column?.sortable ? 'cursor-pointer hover:bg-muted' : ''
                  }`}
                  onClick={() => column?.sortable && handleSort(column?.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column?.label}</span>
                    {column?.sortable && (
                      <Icon
                        name={
                          sortConfig?.key === column?.key
                            ? sortConfig?.direction === 'asc' ?'ChevronUp' :'ChevronDown' :'ChevronsUpDown'
                        }
                        size={14}
                        className="text-text-secondary"
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData?.map((row, index) => (
              <tr
                key={row?.id}
                className={`border-b border-border hover:bg-muted/50 ${
                  selectedTimeRange && 
                  new Date(row.time)?.getHours() >= selectedTimeRange?.start &&
                  new Date(row.time)?.getHours() <= selectedTimeRange?.end
                    ? 'bg-primary/5' :''
                }`}
              >
                {columns?.filter(col => selectedColumns?.includes(col?.key))?.map(column => (
                  <td key={column?.key} className="py-3 px-4">
                    {column?.key === 'optimalCharging' ? (
                      <div className="flex items-center">
                        {row?.[column?.key] ? (
                          <div className="flex items-center text-success">
                            <Icon name="CheckCircle" size={16} className="mr-1" />
                            <span className="text-xs">Yes</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-text-secondary">
                            <Icon name="Circle" size={16} className="mr-1" />
                            <span className="text-xs">No</span>
                          </div>
                        )}
                      </div>
                    ) : column?.key === 'correlation' ? (
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${
                          row?.[column?.key] >= 80 ? 'text-success' :
                          row?.[column?.key] >= 60 ? 'text-secondary' :
                          row?.[column?.key] >= 40 ? 'text-warning' : 'text-error'
                        }`}>
                          {row?.[column?.key]?.toFixed(1)}%
                        </span>
                      </div>
                    ) : typeof row?.[column?.key] === 'number' ? (
                      <span className="font-mono">
                        {column?.key?.includes('Savings') || column?.key?.includes('Reduction') ? 
                          row?.[column?.key]?.toFixed(2) : 
                          row?.[column?.key]?.toFixed(1)
                        }
                        {column?.key?.includes('%') || column?.key?.includes('Availability') || column?.key?.includes('Load') || column?.key?.includes('Generation') ? '%' : ''}
                      </span>
                    ) : (
                      <span>{row?.[column?.key]}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-text-secondary">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData?.length)} of {sortedData?.length} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            iconName="ChevronLeft"
            iconSize={16}
          >
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-8 h-8"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            iconName="ChevronRight"
            iconSize={16}
          >
          </Button>
        </div>
      </div>
      {/* Selected range indicator */}
      {selectedTimeRange && (
        <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-center text-sm">
            <Icon name="Filter" size={16} className="text-primary mr-2" />
            <span className="text-text-primary">
              Highlighting data for selected time range: {selectedTimeRange?.start}:00-{selectedTimeRange?.end}:00
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;