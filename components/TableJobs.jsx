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
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th className="text-xs sm:text-sm">Company</th>
                <th className="text-xs sm:text-sm">Job Title</th>
                <th className="text-xs sm:text-sm">Status</th>
                <th className="hidden sm:table-cell text-xs sm:text-sm">Employment Type</th>
                <th className="hidden md:table-cell text-xs sm:text-sm">Pay Range</th>
                <th className="hidden sm:table-cell text-xs sm:text-sm">Remote?</th>
                <th className="text-xs sm:text-sm">Date Applied</th>
                <th className="text-xs sm:text-sm">Actions</th>
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
    </div>
  );
}

