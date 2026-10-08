import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { JetBrains_Mono } from 'next/font/google';
import styles from './ProductShell.module.css';

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-landing-mono',
  display: 'swap',
});

interface Props {
  children: ReactNode;
  userName?: string | null;
  onSignOut?: () => void;
}

export default function ProductShell({ children, userName, onSignOut }: Props) {
  return (
    <div className={`${styles.shell} ${mono.variable}`}>
      <a href="#page-content" className={styles.skipLink}>
        Skip to content
      </a>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="trim.it home">
          <Image src="/logo.jpg" alt="" width={36} height={36} className={styles.logo} />
          <span>
            trim.it<span className={styles.brandPeriod}>_</span>
          </span>
        </Link>
        <div className={styles.account}>
          {userName && (
            <span className={styles.userName} title={userName}>
              {userName}
            </span>
          )}
          {onSignOut ? (
            <button onClick={onSignOut} className={styles.headerAction}>
              Sign Out
            </button>
          ) : (
            <Link href="/" className={styles.headerAction}>
              Home <span aria-hidden="true">↗</span>
            </Link>
          )}
        </div>
      </header>
      <main id="page-content" className={styles.main}>
        {children}
      </main>
      <footer className={styles.footer}>
        trim.it <span>LESS LINK. MORE SIGNAL.</span>
      </footer>
    </div>
  );
}

interface LoadingSkeletonProps {
  label?: string;
  cards?: boolean;
}

export function LoadingSkeleton({
  label = 'Loading...',
  cards = false,
}: LoadingSkeletonProps) {
  return (
    <div className={styles.loading} role="status" aria-label={label}>
      <span className={styles.visuallyHidden}>{label}</span>
      <div className={styles.skeletonHeading} aria-hidden="true" />
      <div className={styles.skeletonLine} aria-hidden="true" />
      <div className={cards ? styles.skeletonGrid : styles.skeletonStack} aria-hidden="true">
        <div className={styles.skeletonPanel} />
        <div className={styles.skeletonPanel} />
        <div className={styles.skeletonPanel} />
      </div>
    </div>
  );
}
