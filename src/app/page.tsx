import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { JetBrains_Mono } from 'next/font/google';
import AuthButton from '@/components/landing/AuthButton';
import ShortenForm from '@/components/landing/ShortenForm';
import CompressDemo from '@/components/landing/CompressDemo';
import { faq } from '@/components/landing/faq';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
import styles from './page.module.css';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-landing-mono', display: 'swap' });
const source = 'https://github.com/zameel7/urlshortner';
const features = [
  ['ri-edit-line', 'Custom slugs', 'Make the ending yours. Pick a memorable slug that people can read and type.'],
  ['ri-bar-chart-line', 'Click tracking', 'See the click count and last-clicked time. Just the numbers you need.'],
  ['ri-dashboard-line', 'One dashboard', 'All your links, in one place. Edit destinations or delete links anytime.'],
  ['ri-google-line', 'Google sign-in', 'Your Google account gets you in. One less password to remember.'],
  ['ri-file-text-line', 'Shareable link page', 'Give your link a preview page at /l/<slug> before the next click.'],
  ['ri-github-line', 'Free & open source', 'Built in the open. Free while in early access. Take a look under the hood.'],
];
const uses = [
  ['01 / SEND', 'Newsletters', 'Keep every email clean and every campaign easy to share.'],
  ['02 / CONNECT', 'Social bios', 'One memorable link for that very small space.'],
  ['03 / SCAN', 'Event posters / QR codes', 'A compact destination for a poster or QR code.'],
  ['04 / REACH', 'WhatsApp broadcasts', 'Send a link that doesn’t take over the conversation.'],
  ['05 / PRINT', 'Made for print', 'Easy to read. Easy to type. From paper to browser.'],
];
const projects = [
  ['QRapid', 'https://qrcode.zameel7.me'], ['CalSync', 'https://calsync.zameel7.me'],
  ['Photo Frame', 'https://photoframe.zameel7.me'], ['Sight Moon', 'https://moon.zameel7.me'],
  ['Slice of Shame', 'https://slice.zameel7.me'], ['Adkar Champ', 'https://adkar.zameel7.me'],
  ['zameel7.me', 'https://zameel7.me'],
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
    },
    {
      '@type': 'SoftwareApplication',
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      author: { '@type': 'Person', name: 'Zameel Hassan', url: 'https://zameel7.me' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: faq.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ],
};

export default function LandingPage() {
  return <div className={`${styles.container} ${mono.variable}`}>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
    <a className={styles.skipLink} href="#main">Skip to content</a>
    <header className={styles.header}>
      <Link href="/" className={styles.brand} aria-label="trim.it home">
        <Image src="/logo.jpg" alt="" width={36} height={36} className={styles.logo} priority />
        <span>trim.it<span className={styles.brandPeriod}>_</span></span>
      </Link>
      <nav className={styles.nav} aria-label="Main navigation">
        <a href="#how-it-works">How it works</a><a href="#features">Features</a><a href="#faq">FAQ</a>
      </nav>
      <AuthButton />
    </header>
    <main id="main">
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.speedLines} aria-hidden="true"><span /><span /><span /></div>
        <div className={styles.heroTopline}><span className={styles.eyebrow}><span className={styles.statusDot} /> CLEAN & FAST.</span><span className={styles.heroIndex}>URLS, WITHOUT THE EXCESS / 001</span></div>
        <h1 id="hero-title">Long links in.<br /><span>Short links out.</span></h1>
        <div className={styles.heroIntro}><p>Cut the clutter. Create a short link, make it yours,<br className={styles.desktopBreak} /> and see where it goes.</p><span className={styles.heroArrow} aria-hidden="true">↙</span></div>
        <div id="shorten"><ShortenForm /></div>
        <p className={styles.formNote}><span>YOUR LINK. LESS OF IT.</span><span>Google sign-in · Access code required</span></p>
      </section>
      <section className={styles.demoSection} aria-labelledby="demo-title">
        <div className={styles.demoHeading}><h2 id="demo-title">Watch the excess disappear.</h2><span className={styles.eyebrow}>TRY THE REPLAY ↓</span></div>
        <CompressDemo />
      </section>
      <section id="how-it-works" className={styles.section} aria-labelledby="how-title">
        <div className={styles.sectionHeading}><span className={styles.eyebrow}>01 / THE PROCESS</span><h2 id="how-title">Three steps. Then you’re out.</h2></div>
        <div className={styles.steps}>
          {[
            ['01', 'Paste a link', 'Start with the long URL. We’ll take it from here.'],
            ['02', 'Pick a custom slug', 'Choose your own ending, like /s/linen.'],
            ['03', 'Share. Watch the clicks.', 'Put it out there. Check the numbers in your dashboard.'],
          ].map(([number, title, description]) => <article className={styles.step} key={number}>
            <span className={styles.stepNumber}>{number}<span aria-hidden="true">↗</span></span><h3>{title}</h3><p>{description}</p>
          </article>)}
        </div>
      </section>
      <section id="features" className={styles.section} aria-labelledby="features-title">
        <div className={styles.sectionHeading}><span className={styles.eyebrow}>02 / THE TOOLKIT</span><h2 id="features-title">Small link. Full control.</h2></div>
        <div className={styles.featureGrid}>{features.map(([icon, title, description]) =>
          <article className={styles.feature} key={title}><i className={icon} aria-hidden="true" /><h3>{title}</h3><p>{description}</p>
            {title === 'Free & open source' && <a className={styles.textLink} href={source} target="_blank" rel="noopener noreferrer">Explore the source ↗</a>}
          </article>)}</div>
      </section>
      <section className={styles.section} aria-labelledby="uses-title">
        <div className={styles.sectionHeading}><span className={styles.eyebrow}>03 / OUT IN THE WORLD</span><h2 id="uses-title">Fits wherever you share.</h2></div>
        <div className={styles.useGrid}>{uses.map(([tag, title, description]) => <article className={styles.useCard} key={tag}>
          <span className={styles.eyebrow}>{tag}</span><h3>{title}</h3><p>{description}</p>
        </article>)}</div>
      </section>
      <section className={`${styles.section} ${styles.access}`} aria-labelledby="access-title">
        <div><span className={styles.eyebrow}>04 / EARLY ACCESS</span><h2 id="access-title">A small tool.<br />An open invitation.</h2></div>
        <div className={styles.accessDetails}><span className={styles.accessBadge}><span className={styles.statusDot} /> INVITE-ONLY, FOR NOW</span>
          <p>Free while in early access. Sign in with Google, then enter an access code on the plan page.</p>
          <Link className={styles.primaryButton} href="/plan">Got a code? → Unlock</Link>
          <a className={styles.textLink} href="mailto:zameelhassan7@gmail.com?subject=trim.it%20access">No code? Request access ↗</a>
        </div>
      </section>
      <section id="faq" className={`${styles.section} ${styles.faqSection}`} aria-labelledby="faq-title">
        <div className={styles.sectionHeading}><span className={styles.eyebrow}>05 / GOOD QUESTIONS</span><h2 id="faq-title">The short answers.</h2></div>
        <div className={styles.faqList}>{faq.map(({ q, a }, index) => <details className={styles.faqItem} key={q}>
          <summary><span className={styles.faqNumber}>0{index + 1}</span><span>{q}</span><span className={styles.faqToggle} aria-hidden="true" /></summary>
          <p>{a}{index === faq.length - 1 && <> <a href={source} target="_blank" rel="noopener noreferrer">View source ↗</a></>}</p>
        </details>)}</div>
      </section>
      <section className={styles.finalCta} aria-labelledby="cta-title">
        <span className={styles.eyebrow}>LESS IS A LINK AWAY.</span><h2 id="cta-title">Keep it short<span>.</span></h2>
        <a href="#shorten" className={styles.primaryButton}>Trim your first link <span aria-hidden="true">↑</span></a>
      </section>
    </main>
    <footer className={styles.footer}>
      <div className={styles.footerProjects}><span className={styles.eyebrow}>MORE BY ZAMEEL</span><div>{projects.map(([name, url]) => <a key={name} href={url} target="_blank" rel="noopener noreferrer">{name} <span aria-hidden="true">↗</span></a>)}</div></div>
      <div className={styles.footerBottom}><Link href="/" className={styles.footerBrand}>trim.it_</Link><span>© {new Date().getFullYear()} trim.it</span><a href={source} target="_blank" rel="noopener noreferrer"><i className="ri-github-line" aria-hidden="true" /> View source ↗</a></div>
    </footer>
  </div>;
}
