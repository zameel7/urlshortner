'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './plan.module.css';

export default function PlanPage() {
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user, loading, subscribe, isSubscribed, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && isSubscribed) {
      router.push('/dashboard');
    }
  }, [user, loading, router, isSubscribed]);

  if (loading || isSubscribed) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    if (!user) {
      setError('Please log in first.');
      setSubmitting(false);
      return;
    }

    try {
      const result = await subscribe(couponCode.trim());
      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Something went wrong.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <i className="ri-shield-keyhole-line"></i>
          </div>
          <h1 className={styles.title}>Access Restricted</h1>
          <p className={styles.subtitle}>
            Enter your access code to proceed to the dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="coupon" className={styles.label}>ACCESS CODE</label>
          <input
            id="coupon"
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Enter Code"
            className={styles.input}
            required
            autoFocus
            autoComplete="off"
          />

          {error && <div className={styles.error} role="alert">{error}</div>}
          {success && <div className={styles.success} role="status">{success}</div>}

          <button
            type="submit"
            className={styles.button}
            disabled={submitting || !couponCode}
          >
            {submitting ? 'Verifying...' : 'Unlock Access'}
          </button>
        </form>

        <div className={styles.footer}>
          <span className={styles.footerText}>Need access? </span>
          <a href="mailto:zameelhassan7@gmail.com" className={styles.link}>
            Contact Admin
          </a>
        </div>

        <button
          onClick={() => signOut()}
          className={styles.logoutButton}
        >
          Sign Out
        </button>
      </div>
    </main>
  );
}
