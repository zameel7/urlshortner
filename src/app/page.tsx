'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './page.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  const [url, setUrl] = useState('');
  const router = useRouter();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsCreating(true);
    const encodedUrl = encodeURIComponent(url);

    if (user) {
      router.push(`/dashboard?create=${encodedUrl}`);
    } else {
      router.push(`/login?pendingLink=${encodedUrl}`);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Image src="/logo.jpg" alt="Shortly Logo" width={64} height={64} className={styles.logoImage} />
          <h1 className={styles.logoText}>Shortly</h1>
        </div>
        <div className={styles.authButtons}>
          {user ? (
            <Link href="/dashboard" className={styles.loginButton}>
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className={styles.loginButton}>
              Sign In
            </Link>
          )}
        </div>
      </header>

      <main className={styles.hero}>
        <h1 className={styles.title}>
          Shorten <span className={styles.gradientText}>URLs</span> in Seconds
        </h1>
        <p className={styles.subtitle}>
          Create short links, track clicks, and manage your links in one place.
        </p>

        <form onSubmit={handleCreate} className={styles.inputContainer}>
          <input
            type="url"
            placeholder="Enter your URL here..."
            className={styles.input}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button type="submit" className={styles.createButton} disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Shorten URL'}
          </button>
        </form>
      </main>

      <div className={styles.features}>
        <div className={styles.feature}>
          <span className={styles.featureIcon}><i className="ri-links-line"></i></span>
          <h3 className={styles.featureTitle}>Instant Short Links</h3>
          <p className={styles.featureDesc}>Create short, shareable links in one click.</p>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}><i className="ri-edit-line"></i></span>
          <h3 className={styles.featureTitle}>Editable & Manageable</h3>
          <p className={styles.featureDesc}>Update or delete your short links anytime.</p>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}><i className="ri-bar-chart-line"></i></span>
          <h3 className={styles.featureTitle}>Click Analytics</h3>
          <p className={styles.featureDesc}>Track how many times each link is clicked.</p>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>
            Built with <i className="ri-heart-fill" style={{ color: '#ff4d4f' }}></i> by{' '}
            <a href="https://www.zameel7.me" target="_blank" rel="noopener noreferrer" className={styles.footerLinkInd}>
              zameel7
            </a>
          </p>
          <a
            href="https://github.com/zameel7/urlshortner"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.repoLink}
          >
            <i className="ri-github-line"></i> View Source
          </a>
        </div>
      </footer>
    </div>
  );
}
