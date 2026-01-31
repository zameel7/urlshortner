'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'white',
      }}
    >
      <div className="spinner"></div>
    </div>
  );
}
