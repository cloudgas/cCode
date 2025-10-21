'use client';

import { useEffect, useState } from 'react';
import { Job } from '@/types';
import JobCard from './components/JobCard';
import AddJobForm from './components/AddJobForm';

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchJobs();
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (filter === 'paid') return job.is_paid;
    if (filter === 'pending') return !job.is_paid;
    return true;
  });

  const totalAmount = jobs.reduce((sum, job) => sum + job.amount, 0);
  const paidAmount = jobs
    .filter((job) => job.is_paid)
    .reduce((sum, job) => sum + job.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Job Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your jobs, invoices, and payments
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Total Value
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${totalAmount.toFixed(2)}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Paid
            </h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${paidAmount.toFixed(2)}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Pending
            </h3>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              ${pendingAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <AddJobForm onJobAdded={fetchJobs} />

        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            All ({jobs.length})
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === 'paid'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Paid ({jobs.filter((j) => j.is_paid).length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Pending ({jobs.filter((j) => !j.is_paid).length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'all'
                ? 'No jobs yet. Add your first job to get started!'
                : `No ${filter} jobs found.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onUpdate={fetchJobs}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
