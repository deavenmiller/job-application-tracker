'use client';

import { useState } from 'react';
import RowJob from './RowJob';

export default function TableJobs({ jobs, onUpdate, onDelete }) {
  if (jobs.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body text-center py-12">
          <p className="text-lg text-base-content/60">
            No job applications yet. Add your first application to get started!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Company</th>
              <th>Job Title</th>
              <th>Status</th>
              <th>Employment Type</th>
              <th>Pay Range</th>
              <th>Date Applied</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <RowJob
                key={job._id}
                job={job}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

