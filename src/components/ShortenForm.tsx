'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import styles from './ShortenForm.module.css';

interface Props {
  initialUrl?: string;
}

export default function ShortenForm(props: Props) {
  const [url, setUrl] = useState(props.initialUrl ?? '');
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (props.initialUrl) {
      setUrl(props.initialUrl);
    }
  }, [props.initialUrl]);

  const shortenUrl = async () => {
    if (!url.trim()) {
      alert('Please enter a URL');
      return;
    }

    if (!user) {
      alert('Please sign in to shorten links');
      return;
    }

    setLoading(true);
    setShortUrl('');

    try {
      const docRef = await addDoc(collection(db, 'shortlinks'), {
        userId: user.uid,
        longUrl: url.trim(),
        clickCount: 0,
        createdAt: serverTimestamp(),
      });

      setShortUrl(`${typeof window !== 'undefined' ? window.location.origin : ''}/s/${docRef.id}`);
    } catch (error) {
      console.error('Error shortening URL:', error);
      alert('Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const copyShortLink = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    alert('Short link copied to clipboard!');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Shorten URL</h2>

      <div className={styles.inputGroup}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL (e.g., https://example.com)"
          className={styles.input}
          onKeyDown={(e) => e.key === 'Enter' && shortenUrl()}
        />
        <button
          onClick={shortenUrl}
          disabled={loading}
          className={styles.shortenButton}
        >
          {loading ? 'Shortening...' : 'Shorten'}
        </button>
      </div>

      {shortUrl && (
        <div className={styles.result}>
          <p className={styles.resultLabel}>Your short link:</p>
          <div className={styles.resultRow}>
            <code className={styles.shortUrl}>{shortUrl}</code>
            <button onClick={copyShortLink} className={styles.copyButton}>
              <i className="ri-file-copy-line"></i> Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
