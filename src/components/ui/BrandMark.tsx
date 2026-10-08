import { BRAND } from '@/lib/brand';

export default function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="12" fill={BRAND.accent} />
      <g fill="none" stroke={BRAND.background} strokeWidth="5.5" strokeLinecap="square" strokeLinejoin="round">
        {BRAND.paths.map((d) => <path key={d} d={d} />)}
      </g>
    </svg>
  );
}
