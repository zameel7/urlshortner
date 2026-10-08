'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductShell from '@/components/ui/ProductShell';
import styles from './redirect.module.css';

export default function RedirectPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const docRef = doc(db, 'shortlinks', slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const longUrl = data.longUrl;

          try {
            await updateDoc(docRef, {
              clickCount: increment(1),
              lastClicked: serverTimestamp(),
            });
          } catch (err) {
            console.error('Failed to update click count:', err);
          }

          window.location.href = longUrl;
        } else {
          router.push('/');
        }
      } catch (err) {
        console.error('Error fetching redirect:', err);
        router.push('/');
      }
    };

    if (slug) {
      handleRedirect();
    }
  }, [slug, router]);

  return (
    <ProductShell>
      <div className={styles.container} role="status">
        <p className={styles.eyebrow}>LINK / REDIRECT</p>
        <div className={styles.track} aria-hidden="true">
          <span />
        </div>
        <h1>
          Taking you there<span>_</span>
        </h1>
        <p>Opening your destination...</p>
      </div>
    </ProductShell>
  );
}
