'use client';

import { useState } from 'react';

const STATUS_OPTIONS = [
  'Applied',
  'Take-Home Assessment',
  'Objective Assessment',
  'Technical Interview',
  'Behavioral Interview',
  'Final Interview',
  'Rejected',
  'Waitlisted',
  'Ghosted',
  'Accepted',
];

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];

export default function FilterJobs({ filters, onFilterChange, onClearFilters }) {
  const [isExpanded, setIsExpanded] = useState(false);

  function handleStatusChange(status, checked) {
    const newStatuses = checked
      ? [...filters.statuses, status]
      : filters.statuses.filter(s => s !== status);
    onFilterChange({ ...filters, statuses: newStatuses });
  }

  function handleEmploymentTypeChange(type, checked) {
    const newTypes = checked
      ? [...filters.employmentTypes, type]
      : filters.employmentTypes.filter(t => t !== type);
    onFilterChange({ ...filters, employmentTypes: newTypes });
  }

  function handleMinSalaryChange(value) {
    onFilterChange({ ...filters, minSalary: value ? parseInt(value) : '' });
  }

  function handleDateFromChange(value) {
    onFilterChange({ ...filters, dateFrom: value || '' });
  }

  function handleDateToChange(value) {
    onFilterChange({ ...filters, dateTo: value || '' });
  }

  function handleCompanySearchChange(value) {
    onFilterChange({ ...filters, companySearch: value });
  }

  const hasActiveFilters = 
    filters.statuses.length > 0 ||
    filters.employmentTypes.length > 0 ||
    filters.minSalary ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.companySearch;

  return (
    <div className="card bg-base-100 shadow-xl mb-4 sm:mb-6">
      <div className="card-body p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-semibold">Filters</h3>
          <div className="flex gap-2">
            {hasActiveFilters && (
              <button
                className="btn btn-sm btn-ghost"
                onClick={onClearFilters}
              >
                Clear All
              </button>
            )}
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
          </div>
        </div>

        {/* Company Search - Always visible */}
        <div className="form-control mb-4">
          <label className="label py-1 sm:py-2">
            <span className="label-text text-sm sm:text-base">Search Company</span>
          </label>
          <input
            type="text"
            className="input input-bordered text-sm sm:text-base"
            placeholder="Enter company name..."
            value={filters.companySearch}
            onChange={(e) => handleCompanySearchChange(e.target.value)}
          />
        </div>

        {isExpanded && (
          <div className="space-y-4">
            {/* Status Filter */}
            <div className="form-control">
              <label className="label py-1 sm:py-2">
                <span className="label-text text-sm sm:text-base font-semibold">Status</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {STATUS_OPTIONS.map((status) => (
                  <label key={status} className="label cursor-pointer justify-start gap-2">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={filters.statuses.includes(status)}
                      onChange={(e) => handleStatusChange(status, e.target.checked)}
                    />
                    <span className="label-text text-xs sm:text-sm">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Employment Type Filter */}
            <div className="form-control">
              <label className="label py-1 sm:py-2">
                <span className="label-text text-sm sm:text-base font-semibold">Employment Type</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {EMPLOYMENT_TYPES.map((type) => (
                  <label key={type} className="label cursor-pointer justify-start gap-2">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={filters.employmentTypes.includes(type)}
                      onChange={(e) => handleEmploymentTypeChange(type, e.target.checked)}
                    />
                    <span className="label-text text-xs sm:text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pay Range Filter */}
            <div className="form-control">
              <label className="label py-1 sm:py-2">
                <span className="label-text text-sm sm:text-base font-semibold">Minimum Salary</span>
              </label>
              <input
                type="number"
                className="input input-bordered text-sm sm:text-base"
                placeholder="e.g., 50000"
                value={filters.minSalary || ''}
                onChange={(e) => handleMinSalaryChange(e.target.value)}
              />
              <label className="label py-1 sm:py-2">
                <span className="label-text-alt text-xs sm:text-sm">Filter by minimum salary (extracts from pay range)</span>
              </label>
            </div>

            {/* Date Range Filter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label py-1 sm:py-2">
                  <span className="label-text text-sm sm:text-base font-semibold">Date From</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered text-sm sm:text-base"
                  value={filters.dateFrom}
                  onChange={(e) => handleDateFromChange(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label py-1 sm:py-2">
                  <span className="label-text text-sm sm:text-base font-semibold">Date To</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered text-sm sm:text-base"
                  value={filters.dateTo}
                  onChange={(e) => handleDateToChange(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && !isExpanded && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              {filters.statuses.length > 0 && (
                <span className="badge badge-info">
                  {filters.statuses.length} Status{filters.statuses.length > 1 ? 'es' : ''}
                </span>
              )}
              {filters.employmentTypes.length > 0 && (
                <span className="badge badge-info">
                  {filters.employmentTypes.length} Type{filters.employmentTypes.length > 1 ? 's' : ''}
                </span>
              )}
              {filters.minSalary && (
                <span className="badge badge-info">
                  Min: ${filters.minSalary.toLocaleString()}
                </span>
              )}
              {filters.dateFrom && (
                <span className="badge badge-info">
                  From: {new Date(filters.dateFrom).toLocaleDateString()}
                </span>
              )}
              {filters.dateTo && (
                <span className="badge badge-info">
                  To: {new Date(filters.dateTo).toLocaleDateString()}
                </span>
              )}
              {filters.companySearch && (
                <span className="badge badge-info">
                  Company: {filters.companySearch}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

