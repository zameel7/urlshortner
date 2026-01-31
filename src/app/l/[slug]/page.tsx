'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import styles from './link.module.css';

interface LinkData {
  longUrl: string;
  clickCount?: number;
}

export default function LinkSharePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [linkData, setLinkData] = useState<LinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const docRef = doc(db, 'shortlinks', slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setLinkData(docSnap.data() as LinkData);
        } else {
          setError('Short link not found');
        }
      } catch (err) {
        console.error('Error fetching link:', err);
        setError('Failed to load link');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchLink();
    }
  }, [slug]);

  const shortUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/s/${slug}`
      : `/s/${slug}`;

  const copyShortLink = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading link...</div>
      </div>
    );
  }

  if (error || !linkData) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h1>❌ {error || 'Short link not found'}</h1>
          <Link href="/" className={styles.homeLink}>
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Shortly</h1>
        <div className={styles.info}>
          <p className={styles.label}>Short link</p>
          <code className={styles.shortUrl}>{shortUrl}</code>
          <button onClick={copyShortLink} className={styles.copyButton}>
            {copied ? (
              <i className="ri-check-line"></i>
            ) : (
              <i className="ri-file-copy-line"></i>
            )}{' '}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className={styles.info}>
          <p className={styles.label}>Original URL</p>
          <a
            href={linkData.longUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.longUrl}
          >
            {linkData.longUrl}
          </a>
        </div>
        {linkData.clickCount !== undefined && (
          <p className={styles.clickCount}>
            <i className="ri-cursor-line"></i> {linkData.clickCount} clicks
          </p>
        )}
        <div className={styles.actions}>
          <Link href={`/s/${slug}`} className={styles.visitButton}>
            Visit link
          </Link>
          <Link href="/" className={styles.createButton}>
            Create Your Own
          </Link>
        </div>
      </div>
    </div>
  );
}
