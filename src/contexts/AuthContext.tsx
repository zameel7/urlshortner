'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  runTransaction
} from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isSubscribed: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  subscribe: (code: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isSubscribed: false,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  subscribe: async () => ({ success: false, message: 'Not implemented' }),
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      if (authUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', authUser.uid));
          if (userDoc.exists()) {
            setIsSubscribed(userDoc.data().isSubscribed ?? false);
          } else {
            await setDoc(doc(db, 'users', authUser.uid), {
              email: authUser.email,
              isSubscribed: false,
              createdAt: new Date().toISOString()
            });
            setIsSubscribed(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsSubscribed(false);
        }
      } else {
        setIsSubscribed(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setIsSubscribed(false);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const subscribe = async (code: string): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: 'User not logged in' };

    try {
      const couponRef = doc(db, 'coupons', code);
      const userRef = doc(db, 'users', user.uid);

      await runTransaction(db, async (transaction) => {
        const couponDoc = await transaction.get(couponRef);

        if (!couponDoc.exists()) {
          throw new Error('Invalid coupon code');
        }

        const couponData = couponDoc.data();
        if (couponData.isUsed) {
          throw new Error('Coupon code already used');
        }

        transaction.update(couponRef, {
          isUsed: true,
          usedBy: user.uid,
          usedAt: new Date().toISOString()
        });

        transaction.update(userRef, {
          isSubscribed: true,
          couponUsed: code,
          subscriptionDate: new Date().toISOString()
        });
      });

      setIsSubscribed(true);
      return { success: true, message: 'Subscription activated successfully!' };
    } catch (error: unknown) {
      console.error('Subscription error:', error);
      const message = error instanceof Error ? error.message : 'Failed to activate subscription';
      return { success: false, message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isSubscribed, signInWithGoogle, signOut, subscribe }}>
      {children}
    </AuthContext.Provider>
  );
}
