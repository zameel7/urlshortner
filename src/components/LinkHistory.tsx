'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import styles from './LinkHistory.module.css';
import { LoadingSkeleton } from '@/components/ui/ProductShell';

interface ShortlinkData {
  id: string;
  longUrl: string;
  clickCount: number;
  createdAt: Timestamp;
  userId?: string;
}

export default function LinkHistory() {
  const [links, setLinks] = useState<ShortlinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newLongUrl, setNewLongUrl] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (!user) {
      // Defer to avoid synchronous setState in effect (lint: react-hooks/set-state-in-effect)
      queueMicrotask(() => {
        setLinks([]);
        setLoading(false);
      });
    } else {
      const q = query(
        collection(db, 'shortlinks'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as ShortlinkData[];
        setLinks(items);
        setLoading(false);
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  const copyShortLink = async (slug: string) => {
    const shortUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/s/${slug}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(slug);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const startEditing = (link: ShortlinkData) => {
    setEditingId(link.id);
    setNewLongUrl(link.longUrl);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNewLongUrl('');
  };

  const saveEdit = async (id: string) => {
    if (!newLongUrl.trim()) {
      alert('Please enter a valid URL');
      return;
    }

    try {
      const docRef = doc(db, 'shortlinks', id);
      await updateDoc(docRef, {
        longUrl: newLongUrl.trim(),
        updatedAt: new Date(),
      });
      setEditingId(null);
      setNewLongUrl('');
    } catch (err) {
      console.error('Failed to update URL:', err);
      alert('Failed to update URL');
    }
  };

  const deleteLink = async (id: string) => {
    if (!confirm('Delete this short link? It will stop working.')) return;

    try {
      await deleteDoc(doc(db, 'shortlinks', id));
      setEditingId(null);
      setNewLongUrl('');
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('Failed to delete link');
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Your Short Links</h2>
        <LoadingSkeleton cards label="Loading your short links..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>MANAGE / LINK HISTORY</p>
          <h2 className={styles.title}>Your Short Links</h2>
        </div>
        <span className={styles.linkTotal}>{links.length} links</span>
      </div>
      {links.length > 0 && (
        <div className={styles.stats}>
          <div className={styles.statTile}>
            <span>SHORT LINKS</span>
            <strong>{links.length}</strong>
          </div>
          <div className={styles.statTile}>
            <span>TOTAL CLICKS</span>
            <strong>{links.reduce((total, link) => total + (link.clickCount ?? 0), 0)}</strong>
          </div>
        </div>
      )}

      {links.length === 0 ? (
        <div className={styles.empty}>
          <i className="ri-links-line" aria-hidden="true" />
          <h3>Your next link starts here.</h3>
          <p>No short links yet. Create one above!</p>
          <span>PASTE → SHORTEN → SHARE</span>
        </div>
      ) : (
        <div className={styles.grid}>
          {links.map((link) => (
            <div key={link.id} className={styles.card}>
              <div className={styles.info}>
                <p className={styles.longUrl} title={link.longUrl}>
                  {link.longUrl}
                </p>
                <p className={styles.shortUrl}>
                  /s/{link.id}
                </p>
                <p className={styles.date}>{formatDate(link.createdAt)}</p>
                <div className={styles.clickCount}>
                  <span>CLICKS</span>
                  <strong>{link.clickCount ?? 0}</strong>
                </div>
                <div className={styles.actions}>
                  <button
                    onClick={() => copyShortLink(link.id)}
                    className={styles.actionButton}
                    title="Copy short link"
                    aria-label={copiedId === link.id ? 'Copied!' : 'Copy short link'}
                  >
                    {copiedId === link.id ? (
                      <i className="ri-check-line"></i>
                    ) : (
                      <i className="ri-links-line"></i>
                    )}
                  </button>
                  <button
                    onClick={() => startEditing(link)}
                    className={styles.actionButton}
                    title="Edit destination URL"
                    aria-label="Edit destination URL"
                  >
                    <i className="ri-edit-line"></i>
                  </button>
                  <button
                    onClick={() => deleteLink(link.id)}
                    className={styles.actionButton}
                    title="Delete link"
                    aria-label="Delete link"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingId && (
        <div className={styles.modal} onClick={cancelEditing}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-link-title"
            aria-describedby="edit-link-description"
          >
            <h3 id="edit-link-title" className={styles.modalTitle}>Edit Destination URL</h3>
            <p id="edit-link-description" className={styles.modalDescription}>
              Update where this short link redirects to.
            </p>
            <label htmlFor="edit-destination" className={styles.eyebrow}>Destination URL</label>
            <input
              id="edit-destination"
              type="url"
              value={newLongUrl}
              onChange={(e) => setNewLongUrl(e.target.value)}
              placeholder="Enter new URL"
              className={styles.modalInput}
              autoFocus
            />
            <div className={styles.modalButtons}>
              <button onClick={cancelEditing} className={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={() => saveEdit(editingId)} className={styles.saveButton}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
