/**
 * 加密与隐私安全工具
 * 提供端到端传输加密标识、令牌生成、数据脱敏等功能
 */

export function generateEncryptionKeyId(): string {
  const chars = '0123456789ABCDEF';
  let res = 'E2EE-';
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) res += '-';
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
}

export function maskPhoneNumber(phone: string): string {
  if (!phone || phone.length < 7) return phone;
  return phone.slice(0, 3) + '****' + phone.slice(-4);
}

export function formatTripDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h > 0) {
    return `${h}小时${m}分`;
  }
  return `${m}分钟`;
}

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

export function generateShareUrl(code: string): string {
  const baseUrl = window.location.origin || 'https://tourtour.safe.app';
  return `${baseUrl}?shareToken=${code}&view=parent_live&ts=${Date.now()}`;
}
