'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductShell, { LoadingSkeleton } from '@/components/ui/ProductShell';
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
    // Avoid hydration mismatch: only render dashboard content after client mount
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional mount gate
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && initialUrl && user && isSubscribed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- show notification when URL is pre-filled
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
      <ProductShell>
        <LoadingSkeleton cards />
      </ProductShell>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <ProductShell userName={user.displayName} onSignOut={signOut}>
      <div className={styles.main}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>01 / WORKSPACE</p>
          <h1>
            Your links. <span>Less noise.</span>
          </h1>
        </div>
        {showPendingNotification && initialUrl && (
          <div className={styles.pendingNotification} role="status">
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
      </div>
    </ProductShell>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <ProductShell>
          <LoadingSkeleton cards />
        </ProductShell>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
