'use client';

import { useState, useEffect } from 'react';
import FormAddJob from './FormAddJob';
import TableJobs from './TableJobs';

export default function JobTracker() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

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

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <TableJobs
          jobs={jobs}
          onUpdate={handleUpdateJob}
          onDelete={handleDeleteJob}
        />
      )}
    </div>
  );
}

