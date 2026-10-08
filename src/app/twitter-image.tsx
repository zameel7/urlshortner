import { brandSocialImage } from '@/components/ui/BrandSocialImage';

export const alt = 'trim.it — Long links in. Short links out.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function SocialImage() {
  return brandSocialImage();
}
