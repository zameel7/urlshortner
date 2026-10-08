import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { brandSvg, BRAND } from '../src/lib/brand.ts';

const output = fileURLToPath(new URL('../public/', import.meta.url));
const master = Buffer.from(brandSvg());
await writeFile(`${output}logo.svg`, master);
await writeFile(`${output}favicon.svg`, master);

for (const [name, size] of [
  ['logo.png', 512],
  ['icon.png', 512],
  ['icon-192.png', 192],
]) {
  await sharp(master).resize(size, size).png().toFile(`${output}${name}`);
}
// Apple applies its own corner mask; supply a fully opaque square.
await sharp(Buffer.from(brandSvg().replace('rx="12"', 'rx="0"')))
  .resize(180, 180).png().toFile(`${output}apple-touch-icon.png`);
await sharp(Buffer.from(brandSvg(true))).png().toFile(`${output}icon-maskable.png`);
// Retain the original public URL for bookmarks or external consumers.
await sharp(master).flatten({ background: BRAND.background }).jpeg({ quality: 95 }).toFile(`${output}logo.jpg`);

// ICO container with real 16/32/48px PNG entries for legacy browsers.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((size) => sharp(master).resize(size, size).png().toBuffer()));
const header = Buffer.alloc(6 + images.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = header.length;
images.forEach((data, i) => {
  const entry = 6 + i * 16;
  header[entry] = sizes[i];
  header[entry + 1] = sizes[i];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(data.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += data.length;
});
await writeFile(`${output}favicon.ico`, Buffer.concat([header, ...images]));
console.log('Generated logo, favicon, Apple touch, and app icons from src/lib/brand.ts.');
