import { COVER_BASE_URL, fetchMangaDetail } from '../api/otruyen';
import { HistoryItem, FavoriteItem, Category } from '../types';

export function getMangaCoverUrl(thumbUrl: string, cdnImage?: string): string {
  if (!thumbUrl) {
    return 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=350&auto=format&fit=crop';
  }
  if (thumbUrl.startsWith('http') || thumbUrl.startsWith('//')) {
    return thumbUrl;
  }
  
  // Normalize domain
  let domain = cdnImage;
  if (!domain) {
    domain = 'https://img.otruyenapi.com';
  }
  
  // Remove trailing slash if exists
  if (domain.endsWith('/')) {
    domain = domain.slice(0, -1);
  }
  
  // Make sure it has /uploads/comics
  if (!domain.includes('/uploads/comics')) {
    domain = `${domain}/uploads/comics`;
  }
  
  return `${domain}/${thumbUrl}`;
}

export function formatStatus(status: string): string {
  const map: Record<string, string> = {
    ongoing: 'Đang phát hành',
    completed: 'Hoàn thành',
    paused: 'Tạm ngưng',
    upcoming: 'Sắp ra mắt'
  };
  return map[status.toLowerCase()] || status || 'Chưa rõ';
}

export function formatStatusColor(status: string): string {
  const s = status.toLowerCase();
  if (s === 'ongoing' || s === 'dang-phat-hanh') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  if (s === 'completed' || s === 'hoan-thanh') return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
  return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
}

// History LocalStorage handlers
const HISTORY_KEY = 'kinkin_michan_history';
const FAVORITES_KEY = 'kinkin_michan_favorites';

export function getHistory(): HistoryItem[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveHistory(item: HistoryItem): HistoryItem[] {
  try {
    const list = getHistory();
    const filtered = list.filter((h) => h.slug !== item.slug);
    const updated = [item, ...filtered].slice(0, 50); // limit 50 items
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function removeFromHistory(slug: string): HistoryItem[] {
  try {
    const list = getHistory();
    const updated = list.filter((h) => h.slug !== slug);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearAllHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {}
}

// Favorites LocalStorage handlers
export function getFavorites(): FavoriteItem[] {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function isFavorite(slug: string): boolean {
  try {
    const list = getFavorites();
    return list.some((f) => f.slug === slug);
  } catch {
    return false;
  }
}

export function toggleFavorite(item: FavoriteItem): boolean {
  try {
    const list = getFavorites();
    const exists = list.some((f) => f.slug === item.slug);
    let updated;
    if (exists) {
      updated = list.filter((f) => f.slug !== item.slug);
    } else {
      updated = [item, ...list];
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return !exists;
  } catch {
    return false;
  }
}

export function removeFromFavorites(slug: string): FavoriteItem[] {
  try {
    const list = getFavorites();
    const updated = list.filter((f) => f.slug !== slug);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}
