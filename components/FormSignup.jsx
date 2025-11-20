'use client';

import { useState } from 'react';

export default function FormSignup({ onSignup, onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters');
      setIsSubmitting(false);
      return;
    }

    if (firstName.trim().length < 2) {
      setError('First name must be at least 2 characters');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, firstName }),
      });

      const result = await response.json();

      if (result.success) {
        await onSignup();
      } else {
        setError(result.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
      
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <div className="form-control">
        <label className="label">
          <span className="label-text">Username</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username (min 3 characters)"
          required
          disabled={isSubmitting}
          minLength={3}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">First Name</span>
        </label>
        <input
          type="text"
          className="input input-bordered"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter your first name (min 2 characters)"
          required
          disabled={isSubmitting}
          minLength={2}
        />
        <label className="label">
          <span className="label-text-alt">First name will be used as your password</span>
        </label>
      </div>

      <div className="form-control mt-6">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || !username.trim() || !firstName.trim()}
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Signing up...
            </>
          ) : (
            'Sign Up'
          )}
        </button>
      </div>

      <div className="text-center">
        <button
          type="button"
          className="link link-primary"
          onClick={onSwitchToLogin}
          disabled={isSubmitting}
        >
          Already have an account? Login
        </button>
      </div>
    </form>
  );
}

