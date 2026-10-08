/** Shared vector geometry for the website, social cards, and generated icons. */
export const BRAND = {
  background: '#0a0b0d',
  accent: '#c6ff3d',
  foreground: '#f2f3ed',
  // Two shortened links and a connecting slash, readable even at 16px.
  paths: [
    'M29 22L36 15C40 11 46 11 50 15C54 19 54 25 50 29L43 36',
    'M35 42L28 49C24 53 18 53 14 49C10 45 10 39 14 35L21 28',
    'M24 40L40 24',
  ],
};

export function brandSvg(maskable = false): string {
  const paths = BRAND.paths.map((d) => `<path d="${d}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 64 64"><rect width="64" height="64" rx="${maskable ? 0 : 12}" fill="${BRAND.accent}"/><g ${maskable ? 'transform="translate(8 8) scale(.75)"' : ''} fill="none" stroke="${BRAND.background}" stroke-width="5.5" stroke-linecap="square" stroke-linejoin="round">${paths}</g></svg>`;
}
