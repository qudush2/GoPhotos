/**
 * Helpers for building human-readable `alt` text for photos.
 *
 * These replace alt text derived from the raw S3 object key
 * (e.g. `image.key.split("/").pop()`), which produces a hashed filename
 * rather than a description a screen reader user can act on. Each helper
 * only uses data already available at its call site (position in a list,
 * associated skills/tags, etc.) so no new data fetching is required.
 *
 * Pure functions, no side effects - kept small and easy to reason about.
 */

/**
 * Builds alt text for a photo identified only by its position in a list,
 * e.g. "Event photo 3 of 12".
 */
export function buildIndexedPhotoAlt(
  label: string,
  index: number,
  total: number
): string {
  return `${label} ${index + 1} of ${total}`;
}

/**
 * Builds alt text for a portfolio photo, preferring the skills/tags
 * associated with it when available, and falling back to its position.
 */
export function buildSkillPhotoAlt(
  skills: string[] | undefined,
  index: number
): string {
  if (skills && skills.length > 0) {
    return `Portfolio photo showcasing ${skills.join(", ")}`;
  }
  return `Portfolio photo ${index + 1}`;
}
