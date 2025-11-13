/**
 * Generate a pleasant avatar URL using DiceBear API
 * Creates fun, friendly avatar images based on the user's name
 */
export const getAvatarUrl = (name: string, style: 'avataaars' | 'bottts' | 'fun-emoji' | 'lorelei' = 'lorelei') => {
  const seed = encodeURIComponent(name);
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
};

/**
 * Fallback to UI Avatars for simple initials-based avatars
 */
export const getUIAvatarUrl = (name: string, background?: string, color?: string) => {
  const bg = background || '6366f1'; // primary color
  const fg = color || 'ffffff';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=${fg}&size=128&bold=true&rounded=true`;
};
