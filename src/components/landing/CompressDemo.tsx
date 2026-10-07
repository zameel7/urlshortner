'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '@/app/page.module.css';

const longUrl = 'https://www.example-store.com/collections/summer-2026/products/linen-shirt?utm_source=newsletter&utm_medium=email&utm_campaign=launch';
const bars = [18, 28, 22, 38, 30, 46, 42, 58, 48, 64, 72, 60, 82, 76, 90, 100];

export default function CompressDemo() {
  const root = useRef<HTMLDivElement>(null);
  const [replay, setReplay] = useState(0);
  const [phase, setPhase] = useState('ready');
  const [count, setCount] = useState(0);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timers: ReturnType<typeof setTimeout>[] = [];
    let ticker: ReturnType<typeof setInterval> | undefined;
    let started = false;
    function clear() {
      timers.forEach(clearTimeout);
      if (ticker) clearInterval(ticker);
    }
    function play() {
      if (motion.matches || started) return;
      started = true;
      timers.push(setTimeout(() => { setPhase('ready'); setCount(0); }, 0));
      timers.push(setTimeout(() => setPhase('compressing'), 900));
      timers.push(setTimeout(() => {
        setPhase('done');
        let tick = 0;
        ticker = setInterval(() => {
          tick += 1;
          setCount(Math.round(1284 * (1 - Math.pow(1 - tick / 32, 3))));
          if (tick >= 32) clearInterval(ticker);
        }, 40);
      }, 1450));
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) play();
    }, { threshold: 0.25 });
    if (root.current) observer.observe(root.current);
    function changeMotion() {
      clear();
      started = false;
      if (!motion.matches) play();
    }
    motion.addEventListener('change', changeMotion);
    return () => { clear(); observer.disconnect(); motion.removeEventListener('change', changeMotion); };
  }, [replay]);

  return <div ref={root} className={styles.demo} data-phase={phase}>
    <div className={styles.demoToolbar}>
      <span><span className={styles.statusDot} /> LINK COMPRESSOR</span>
      <span className={styles.demoBadge}>LIVE DEMO / SAMPLE DATA</span>
    </div>
    <div className={styles.demoBody}>
      <div className={styles.demoLinkPanel}>
        <div className={styles.demoLabels}><span>INPUT → OUTPUT</span><span>LESS LINK. MORE IMPACT.</span></div>
        <div className={styles.urlStage} aria-label="Example: a long store URL becomes trimit.zameel7.me/s/linen">
          <p className={styles.longUrl} aria-hidden="true">{longUrl}</p>
          <p className={styles.shortUrl} aria-hidden="true">trimit.zameel7.me<span>/s/linen</span><i className="ri-arrow-right-up-line" /></p>
          <span className={styles.demoWipe} aria-hidden="true" />
        </div>
        <div className={styles.demoBottom}><span>CUSTOM SLUG <b>/linen</b></span>
          <button type="button" className={styles.replayButton} onClick={() => setReplay(value => value + 1)}>
            <i className="ri-restart-line" aria-hidden="true" /> Replay
          </button>
        </div>
      </div>
      <div className={styles.demoStats}>
        <span className={styles.eyebrow}>TOTAL CLICKS</span>
        <strong className={styles.animatedCount}>{count.toLocaleString('en-US')}</strong>
        <strong className={styles.staticCount}>1,284</strong>
        <div className={styles.barChart} aria-hidden="true">{bars.map((height, index) =>
          <span key={index} style={{ height: `${height}%`, animationDelay: `${index * 25}ms` }} />
        )}</div>
        <span className={styles.demoCaption}>A little link. Going places.</span>
      </div>
    </div>
    <p className={styles.visuallyHidden}>Illustrative demo: the shortened link receives 1,284 clicks. No link is created.</p>
  </div>;
}
