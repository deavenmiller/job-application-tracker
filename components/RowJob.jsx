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

export default function RowJob({ job, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState({
    company: job.company || '',
    jobTitle: job.jobTitle || '',
    status: job.status || 'Applied',
    jobLink: job.jobLink || '',
    payRange: job.payRange || '',
    benefits: job.benefits || '',
    employmentType: job.employmentType || 'Full-time',
    dateApplied: job.dateApplied ? new Date(job.dateApplied).toISOString().split('T')[0] : '',
  });

  function handleSave() {
    onUpdate(job._id, editedJob);
    setIsEditing(false);
  }

  function handleCancel() {
    setEditedJob({
      company: job.company || '',
      jobTitle: job.jobTitle || '',
      status: job.status || 'Applied',
      jobLink: job.jobLink || '',
      payRange: job.payRange || '',
      benefits: job.benefits || '',
      employmentType: job.employmentType || 'Full-time',
      dateApplied: job.dateApplied ? new Date(job.dateApplied).toISOString().split('T')[0] : '',
    });
    setIsEditing(false);
  }

  function getStatusBadgeClass(status) {
    const classes = {
      'Applied': 'badge-info',
      'Take-Home Assessment': 'badge-warning',
      'Objective Assessment': 'badge-warning',
      'Technical Interview': 'badge-warning',
      'Behavioral Interview': 'badge-warning',
      'Final Interview': 'badge-warning',
      'Rejected': 'badge-error',
      'Waitlisted': 'badge-warning',
      'Ghosted': 'badge-ghost',
      'Accepted': 'badge-success',
    };
    return classes[status] || 'badge';
  }

  function getFullUrl(url) {
    if (!url) return '';
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    return `https://${trimmed}`;
  }

  function handleLinkClick(e, url) {
    e.preventDefault();
    const fullUrl = getFullUrl(url);
    if (fullUrl) {
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    }
  }

  const dateApplied = job.dateApplied
    ? new Date(job.dateApplied).toLocaleDateString()
    : 'N/A';

  if (isEditing) {
    return (
      <tr className="bg-base-200">
        <td colSpan="7">
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Company *</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={editedJob.company}
                  onChange={(e) =>
                    setEditedJob({ ...editedJob, company: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Job Title *</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={editedJob.jobTitle}
                  onChange={(e) =>
                    setEditedJob({ ...editedJob, jobTitle: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Status</span>
                </label>
                <select
                  className="select select-bordered"
                  value={editedJob.status}
                  onChange={(e) =>
                    setEditedJob({ ...editedJob, status: e.target.value })
                  }
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Employment Type</span>
                </label>
                <select
                  className="select select-bordered"
                  value={editedJob.employmentType}
                  onChange={(e) =>
                    setEditedJob({ ...editedJob, employmentType: e.target.value })
                  }
                >
                  {EMPLOYMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Job Link</span>
                </label>
                <input
                  type="url"
                  className="input input-bordered"
                  value={editedJob.jobLink}
                  onChange={(e) =>
                    setEditedJob({ ...editedJob, jobLink: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Pay Range</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={editedJob.payRange}
                  onChange={(e) =>
                    setEditedJob({ ...editedJob, payRange: e.target.value })
                  }
                  placeholder="e.g., $80k - $120k"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Date Applied</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered"
                  value={editedJob.dateApplied}
                  onChange={(e) =>
                    setEditedJob({ ...editedJob, dateApplied: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Benefits</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                value={editedJob.benefits}
                onChange={(e) =>
                  setEditedJob({ ...editedJob, benefits: e.target.value })
                }
                placeholder="Health insurance, 401k, etc."
                rows="3"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="btn btn-ghost"
                onClick={handleCancel}
                type="button"
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                type="button"
              >
                Save Changes
              </button>
            </div>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <>
      <tr>
        <td className="font-semibold">{job.company}</td>
        <td>{job.jobTitle}</td>
        <td>
          <span className={`badge ${getStatusBadgeClass(job.status)}`}>
            {job.status}
          </span>
        </td>
        <td>{job.employmentType}</td>
        <td>{job.payRange || 'N/A'}</td>
        <td>{dateApplied}</td>
        <td>
          <div className="flex gap-2">
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="btn btn-sm btn-error"
              onClick={() => onDelete(job._id)}
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
      {job.jobLink && (
        <tr>
          <td colSpan="7" className="text-sm text-base-content/60">
            <a
              href={getFullUrl(job.jobLink)}
              target="_blank"
              rel="noopener noreferrer"
              className="link link-primary"
              onClick={(e) => handleLinkClick(e, job.jobLink)}
            >
              View Job Listing →
            </a>
            {job.benefits && (
              <span className="ml-4">
                Benefits: {job.benefits.substring(0, 100)}
                {job.benefits.length > 100 ? '...' : ''}
              </span>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

