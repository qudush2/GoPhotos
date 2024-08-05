const CLOUDFRONT_DOMAIN_OPTIMIZED = process.env.CLOUDFRONT_DOMAIN_OPTIMIZED;

export function getImageUrl(
  key: string,
  width?: number,
  height?: number,
  format: string = "auto",
  quality: string | number = "auto"
): string {
  const baseUrl = `https://${CLOUDFRONT_DOMAIN_OPTIMIZED}/${key}`;
  const params = new URLSearchParams();

  if (width) params.append("width", width.toString());
  if (height) params.append("height", height.toString());
  params.append("format", format);
  params.append("quality", quality.toString());

  return `${baseUrl}?${params.toString()}`;
}
