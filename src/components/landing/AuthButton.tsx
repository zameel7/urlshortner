'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import styles from '@/app/page.module.css';

export default function AuthButton() {
  const { user } = useAuth();
  return <Link href={user ? '/dashboard' : '/login'} className={styles.authButton}>
    {user ? 'Dashboard' : 'Sign In'} <span aria-hidden="true">↗</span>
  </Link>;
}
