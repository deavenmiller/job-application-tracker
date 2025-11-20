'use client';

import { useState } from 'react';

export default function FormLogin({ onLogin, onSwitchToSignup }) {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, firstName }),
      });

      const result = await response.json();

      if (result.success) {
        await onLogin();
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      
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
          placeholder="Enter your username"
          required
          disabled={isSubmitting}
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
          placeholder="Enter your first name"
          required
          disabled={isSubmitting}
        />
        <label className="label">
          <span className="label-text-alt">First name is used as your password</span>
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
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>
      </div>

      <div className="text-center">
        <button
          type="button"
          className="link link-primary"
          onClick={onSwitchToSignup}
          disabled={isSubmitting}
        >
          Don't have an account? Sign up
        </button>
      </div>
    </form>
  );
}

