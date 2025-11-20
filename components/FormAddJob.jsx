'use client';

import { useState } from 'react';

export default function FormAddJob({ onSubmit }) {
  const [jobDescription, setJobDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({ jobDescription });
      setJobDescription('');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Add New Job Application</h3>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Paste Job Description</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-32"
          placeholder="Paste the full job description here. The system will automatically extract key information like company name, job title, pay range, benefits, etc."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          required
        />
        <label className="label">
          <span className="label-text-alt">The system will automatically extract information from the description</span>
        </label>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || !jobDescription.trim()}
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Processing...
            </>
          ) : (
            'Add Application'
          )}
        </button>
      </div>
    </form>
  );
}

