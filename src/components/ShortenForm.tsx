'use client';

import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import styles from './ShortenForm.module.css';

const SLUG_REGEX = /^[a-z0-9_-]+$/;
const SLUG_MIN_LENGTH = 1;
const SLUG_MAX_LENGTH = 100;

interface Props {
  initialUrl?: string;
}

export default function ShortenForm(props: Props) {
  const [url, setUrl] = useState(props.initialUrl ?? '');
  const [customPath, setCustomPath] = useState('');
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

    const slug = customPath.trim().toLowerCase();
    if (!slug) {
      alert('Please enter a custom path (e.g. somerandomtext). This will be used in your short link: /s/yourpath');
      return;
    }
    if (slug.length < SLUG_MIN_LENGTH || slug.length > SLUG_MAX_LENGTH) {
      alert(`Custom path must be between ${SLUG_MIN_LENGTH} and ${SLUG_MAX_LENGTH} characters.`);
      return;
    }
    if (!SLUG_REGEX.test(slug)) {
      alert('Custom path can only contain lowercase letters, numbers, hyphens (-), and underscores (_).');
      return;
    }

    setLoading(true);
    setShortUrl('');

    try {
      const docRef = doc(db, 'shortlinks', slug);
      const existing = await getDoc(docRef);
      if (existing.exists()) {
        alert('This short path is already taken. Please choose another.');
        setLoading(false);
        return;
      }

      await setDoc(docRef, {
        userId: user.uid,
        longUrl: url.trim(),
        clickCount: 0,
        createdAt: serverTimestamp(),
      });

      setShortUrl(`${typeof window !== 'undefined' ? window.location.origin : ''}/s/${slug}`);
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

      <div className={styles.inputGroup}>
        <label className={styles.pathLabel} htmlFor="custom-path">
          Custom path (your short link will be /s/<strong>yourpath</strong>)
        </label>
        <input
          id="custom-path"
          type="text"
          value={customPath}
          onChange={(e) => setCustomPath(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
          placeholder="e.g. somerandomtext"
          className={styles.input}
          onKeyDown={(e) => e.key === 'Enter' && shortenUrl()}
          maxLength={SLUG_MAX_LENGTH}
        />
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
