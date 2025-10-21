'use client';

import { Job } from '@/types';
import { useState } from 'react';

interface JobCardProps {
  job: Job;
  onUpdate: () => void;
  onDelete: (id: string) => void;
}

export default function JobCard({ job, onUpdate, onDelete }: JobCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPaid, setIsPaid] = useState(job.is_paid);
  const [paymentDate, setPaymentDate] = useState(job.payment_date || '');
  const [paymentReference, setPaymentReference] = useState(job.payment_reference || '');
  const [loading, setLoading] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [todayCompleted, setTodayCompleted] = useState(false);

  const handleUpdatePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/jobs/${job.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_paid: isPaid,
          payment_date: isPaid ? paymentDate : null,
          payment_reference: isPaid ? paymentReference : null,
        }),
      });

      if (response.ok) {
        setIsEditing(false);
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProgress = async () => {
    const today = new Date().toISOString().split('T')[0];
    const newStatus = !todayCompleted;

    setLoading(true);
    try {
      const response = await fetch(`/api/jobs/${job.id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: today,
          completed: newStatus,
        }),
      });

      if (response.ok) {
        setTodayCompleted(newStatus);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            {job.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Client: {job.client_name}
          </p>
          {job.description && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              {job.description}
            </p>
          )}
        </div>
        <button
          onClick={() => onDelete(job.id)}
          className="text-red-500 hover:text-red-700 text-sm font-medium"
          disabled={loading}
        >
          Delete
        </button>
      </div>

      <div className="border-t pt-4 dark:border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ${job.amount.toFixed(2)}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              job.is_paid
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }`}
          >
            {job.is_paid ? 'Paid' : 'Pending Invoice'}
          </span>
        </div>

        {job.is_paid && job.payment_date && (
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            <p>Paid on: {new Date(job.payment_date).toLocaleDateString()}</p>
            {job.payment_reference && (
              <p>Reference: {job.payment_reference}</p>
            )}
          </div>
        )}

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {job.is_paid ? 'Update Payment Info' : 'Mark as Paid'}
          </button>
        ) : (
          <div className="mt-4 space-y-3 bg-gray-50 dark:bg-gray-700 p-4 rounded">
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`paid-${job.id}`}
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label
                htmlFor={`paid-${job.id}`}
                className="ml-2 text-sm text-gray-700 dark:text-gray-300"
              >
                Mark as paid
              </label>
            </div>

            {isPaid && (
              <>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  placeholder="Payment date"
                />
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  placeholder="Payment reference (optional)"
                />
              </>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleUpdatePayment}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t dark:border-gray-700">
          <button
            onClick={handleToggleProgress}
            disabled={loading}
            className="flex items-center gap-2 text-sm font-medium"
          >
            <input
              type="checkbox"
              checked={todayCompleted}
              onChange={handleToggleProgress}
              disabled={loading}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700 dark:text-gray-300">
              Mark today's progress
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
