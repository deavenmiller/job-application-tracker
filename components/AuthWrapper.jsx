'use client';

import { useState, useEffect } from 'react';
import FormLogin from './FormLogin';
import FormSignup from './FormSignup';
import JobTracker from './JobTracker';

export default function AuthWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(null);

  async function checkAuth() {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      const result = await response.json();
      
      if (result.success) {
        setIsAuthenticated(true);
        setUser(result.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  async function handleLogin() {
    await checkAuth();
  }

  async function handleSignup() {
    await checkAuth();
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include',
      });
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {showSignup ? (
              <FormSignup
                onSignup={handleSignup}
                onSwitchToLogin={() => setShowSignup(false)}
              />
            ) : (
              <FormLogin
                onLogin={handleLogin}
                onSwitchToSignup={() => setShowSignup(true)}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4">
        <div className="text-xs sm:text-sm text-base-content/60">
          Welcome, <span className="font-semibold">{user?.firstName}</span> <span className="hidden sm:inline">({user?.username})</span>
        </div>
        <button
          className="btn btn-xs sm:btn-sm btn-ghost w-full sm:w-auto"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <JobTracker />
    </div>
  );
}

