let __idCounter = 0;
export function genId(prefix: string): string {
  __idCounter += 1;
  return `${prefix}_${Date.now().toString(36)}_${__idCounter}`;
}

export function tint(color: string, alpha: number): string {
  if (!color) return 'transparent';
  return color.replace(')', ` / ${alpha})`);
}

export const PALETTE = [264, 45, 250, 35, 270, 55, 240, 40].map(
  h => `oklch(60% 0.16 ${h})`
);

export const STORAGE_KEY = 'wedding-guest-list-v4';
