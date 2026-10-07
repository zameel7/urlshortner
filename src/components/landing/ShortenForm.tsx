'use client';

import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from '@/app/page.module.css';

export default function ShortenForm() {
  const id = useId();
  const [url, setUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!url.trim()) return;
    setIsCreating(true);
    const encoded = encodeURIComponent(url);
    router.push(user ? '/dashboard?create=' + encoded : '/login?pendingLink=' + encoded);
  }

  return <form className={styles.shortenForm} onSubmit={handleCreate}>
    <label className={styles.visuallyHidden} htmlFor={id}>URL to shorten</label>
    <span className={styles.inputPrompt} aria-hidden="true">↳</span>
    <input id={id} type="url" required value={url} onChange={event => setUrl(event.target.value)}
      placeholder="Paste your long URL" autoComplete="url" />
    <button className={styles.primaryButton} type="submit" disabled={isCreating}>
      {isCreating ? 'Creating...' : 'Shorten link'} <span aria-hidden="true">→</span>
    </button>
  </form>;
}
