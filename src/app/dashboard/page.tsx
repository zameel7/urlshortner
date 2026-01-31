'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import ShortenForm from '@/components/ShortenForm';
import LinkHistory from '@/components/LinkHistory';
import styles from './page.module.css';

function DashboardContent() {
  const { user, loading, signOut, isSubscribed } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get('create');
  const [mounted, setMounted] = useState(false);
  const [showPendingNotification, setShowPendingNotification] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && initialUrl && user && isSubscribed) {
      setShowPendingNotification(true);
      const timer = setTimeout(() => setShowPendingNotification(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [mounted, initialUrl, user, isSubscribed]);

  useEffect(() => {
    if (mounted && !loading) {
      if (!user) {
        router.push('/login');
      } else if (!isSubscribed) {
        router.push('/plan');
      }
    }
  }, [user, loading, router, mounted, isSubscribed]);

  if (!mounted || loading) {
    return (
      <div className={styles.loading}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoContainer}>
            <Image src="/logo.png" alt="Shortly Logo" width={48} height={48} className={styles.logoImage} />
            <h1 className={styles.logoText}>Shortly</h1>
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user.displayName}</span>
            <button onClick={signOut} className={styles.signOutButton}>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {showPendingNotification && initialUrl && (
          <div className={styles.pendingNotification}>
            <div className={styles.notificationContent}>
              <i className="ri-information-line"></i>
              <div className={styles.notificationText}>
                <strong>Link ready to shorten!</strong>
                <p>Your URL has been pre-filled below. Click <strong>Shorten</strong> to create your short link.</p>
              </div>
              <button
                className={styles.notificationClose}
                onClick={() => setShowPendingNotification(false)}
                aria-label="Close notification"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
          </div>
        )}
        <ShortenForm initialUrl={initialUrl ?? undefined} />
        <LinkHistory />
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className={styles.loading}><p>Loading...</p></div>}>
      <DashboardContent />
    </Suspense>
  );
}
