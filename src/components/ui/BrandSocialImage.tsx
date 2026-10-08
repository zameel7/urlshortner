import { ImageResponse } from 'next/og';
import BrandMark from './BrandMark';
import { BRAND } from '@/lib/brand';

export const socialImageSize = { width: 1200, height: 630 };

export function brandSocialImage() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: BRAND.background, color: BRAND.foreground, padding: '56px 64px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 38, fontWeight: 700, letterSpacing: -2 }}>
          <BrandMark size={52} />
          <span>trim.it<span style={{ color: BRAND.accent }}>_</span></span>
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 16, letterSpacing: 2, color: '#a2a69d' }}>LESS LINK. MORE SIGNAL.</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 78, fontWeight: 800, letterSpacing: -4, lineHeight: 1.08 }}>
          <span>Long links in.</span>
          <span style={{ color: BRAND.accent }}>Short links out.</span>
        </div>
        <BrandMark size={192} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, paddingTop: 28, borderTop: '1px solid #30342d' }}>
        <div style={{ display: 'flex', fontSize: 23, color: '#a2a69d' }}>Clean links. Custom slugs. Every click counted.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'monospace', fontSize: 25 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={BRAND.accent} strokeWidth="2">
            <path d="M5 19L19 5M5 5H19V19" />
          </svg>
          <span>trimit.zameel7.me/s/your-link</span>
        </div>
      </div>
    </div>,
    socialImageSize,
  );
}
