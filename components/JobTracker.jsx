'use client';

import { useState, useEffect, useMemo } from 'react';
import FormAddJob from './FormAddJob';
import TableJobs from './TableJobs';
import FilterJobs from './FilterJobs';

export default function JobTracker() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filters, setFilters] = useState({
    statuses: [],
    employmentTypes: [],
    minSalary: '',
    dateFrom: '',
    dateTo: '',
    companySearch: '',
    remote: false,
  });

  async function fetchJobs() {
    try {
      setLoading(true);
      const response = await fetch('/api/jobs', {
        credentials: 'include',
      });
      const result = await response.json();
      if (result.success) {
        setJobs(result.data);
      } else if (result.error === 'Authentication required') {
        // User not authenticated, redirect to login
        window.location.reload();
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  async function handleAddJob(jobData) {
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(jobData),
      });
      const result = await response.json();
      if (result.success) {
        await fetchJobs();
        setShowAddForm(false);
      } else {
        if (result.error === 'Authentication required') {
          alert('You must be logged in to add jobs. Please refresh the page.');
          window.location.reload();
        } else {
          alert('Error adding job: ' + result.error);
        }
      }
    } catch (error) {
      console.error('Error adding job:', error);
      alert('Error adding job');
    }
  }

  async function handleUpdateJob(id, updates) {
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });
      const result = await response.json();
      if (result.success) {
        await fetchJobs();
      } else {
        alert('Error updating job: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating job:', error);
      alert('Error updating job');
    }
  }

  async function handleDeleteJob(id) {
    if (!confirm('Are you sure you want to delete this job application?')) {
      return;
    }
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const result = await response.json();
      if (result.success) {
        await fetchJobs();
      } else {
        alert('Error deleting job: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Error deleting job');
    }
  }

  function handleFilterChange(newFilters) {
    setFilters(newFilters);
  }

  function handleClearFilters() {
    setFilters({
      statuses: [],
      employmentTypes: [],
      minSalary: '',
      dateFrom: '',
      dateTo: '',
      companySearch: '',
      remote: false,
    });
  }

  // Filter jobs based on active filters
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Status filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(job.status)) {
        return false;
      }

      // Employment Type filter
      if (filters.employmentTypes.length > 0 && !filters.employmentTypes.includes(job.employmentType)) {
        return false;
      }

      // Company search - exact match from start (case-insensitive)
      if (filters.companySearch) {
        const searchTerm = filters.companySearch.toLowerCase().trim();
        const companyName = job.company.toLowerCase().trim();
        if (!companyName.startsWith(searchTerm)) {
          return false;
        }
      }

      // Min Salary filter - extract number from pay range
      if (filters.minSalary) {
        const payRange = job.payRange || '';
        // Extract numbers from pay range (e.g., "$80k - $120k" or "$80,000 - $120,000")
        const numbers = payRange.match(/[\d,]+/g);
        if (numbers && numbers.length > 0) {
          // Get the first number (minimum salary)
          const minPay = parseInt(numbers[0].replace(/,/g, ''));
          // Check if it ends with 'k' or 'K' (thousands)
          const isK = payRange.toLowerCase().includes('k');
          const actualMinPay = isK ? minPay * 1000 : minPay;
          
          if (actualMinPay < filters.minSalary) {
            return false;
          }
        } else {
          // No pay range found, exclude if filter is set
          return false;
        }
      }

      // Date range filter
      if (filters.dateFrom || filters.dateTo) {
        const jobDate = new Date(job.dateApplied);
        jobDate.setHours(0, 0, 0, 0);

        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          fromDate.setHours(0, 0, 0, 0);
          if (jobDate < fromDate) {
            return false;
          }
        }

        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          toDate.setHours(23, 59, 59, 999);
          if (jobDate > toDate) {
            return false;
          }
        }
      }

      // Remote filter
      if (filters.remote && job.remote !== 'Yes') {
        return false;
      }

      return true;
    });
  }, [jobs, filters]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Your Applications</h2>
        <button
          className="btn btn-primary w-full sm:w-auto btn-sm sm:btn-md"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add New Application'}
        </button>
      </div>

      {showAddForm && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-4 sm:p-6">
            <FormAddJob onSubmit={handleAddJob} />
          </div>
        </div>
      )}

      <FilterJobs
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          <div className="text-sm text-base-content/60 mb-2">
            Showing {filteredJobs.length} of {jobs.length} application{jobs.length !== 1 ? 's' : ''}
          </div>
          <TableJobs
            jobs={filteredJobs}
            onUpdate={handleUpdateJob}
            onDelete={handleDeleteJob}
          />
        </>
      )}
    </div>
  );
}

