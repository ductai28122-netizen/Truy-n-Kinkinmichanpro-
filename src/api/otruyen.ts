import { MangaItem, MangaDetail, ChapterDetail, Category, Pagination } from '../types';

const BASE_API_URL = 'https://otruyenapi.com/v1/api';
export const COVER_BASE_URL = 'https://img.otruyenapi.com/uploads/comics';

export interface ListResponse {
  titlePage: string;
  items: MangaItem[];
  pagination: Pagination;
  cdnImage: string;
}

export async function fetchMangaList(slug: string, page: number = 1): Promise<ListResponse> {
  const url = `${BASE_API_URL}/danh-sach/${slug}?page=${page}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Không thể tải danh sách truyện');
  const json = await res.json();
  if (json.status !== 'success') throw new Error(json.message || 'Lỗi API');
  
  return {
    titlePage: json.data.titlePage || 'Danh sách truyện',
    items: json.data.items || [],
    pagination: json.data.params.pagination,
    cdnImage: json.data.APP_DOMAIN_CDN_IMAGE || COVER_BASE_URL
  };
}

export async function fetchMangaDetail(slug: string): Promise<{ item: MangaDetail; cdnImage: string }> {
  console.log('[DEBUG] fetchMangaDetail request started. slug:', slug);
  const url = `${BASE_API_URL}/truyen-tranh/${slug}`;
  console.log('[DEBUG] Request url:', url);
  const res = await fetch(url);
  if (!res.ok) {
    console.error('[DEBUG] fetchMangaDetail HTTP failed:', res.status, res.statusText);
    throw new Error('Không thể tải chi tiết truyện');
  }
  const json = await res.json();
  console.log('[DEBUG] fetchMangaDetail API status:', json?.status);
  
  if (!json || json.status !== 'success' || !json.data?.item) {
    console.error('[DEBUG] fetchMangaDetail API response invalid or missing item data:', json);
    throw new Error(json?.message || 'Không thể tìm thấy chi tiết truyện.');
  }
  
  return {
    item: json.data.item,
    cdnImage: json.data.APP_DOMAIN_CDN_IMAGE || COVER_BASE_URL
  };
}

export async function fetchChapterDetail(chapterApiUrl: string): Promise<ChapterDetail> {
  console.log('[DEBUG] fetchChapterDetail request started. api:', chapterApiUrl);
  const res = await fetch(chapterApiUrl);
  if (!res.ok) {
    console.error('[DEBUG] fetchChapterDetail HTTP failed:', res.status);
    throw new Error('Không thể tải nội dung chương');
  }
  const json = await res.json();
  console.log('CHAPTER API RESPONSE:', json);
  
  if (!json || json.status !== 'success' || !json.data?.item) {
    console.error('[DEBUG] fetchChapterDetail response invalid:', json);
    throw new Error(json?.message || 'Lỗi tải chi tiết chương');
  }
  
  const item = json.data.item;
  const domain_cdn = json.data.domain_cdn || item.server_image || '';
  const chapter_images = (item.chapter_image || item.chapter_images || []).map((img: any, idx: number) => ({
    image_file: img.image_file || '',
    image_page: typeof img.image_page === 'number' ? img.image_page : (idx + 1)
  }));

  return {
    _id: item._id || '',
    comic_name: item.comic_name || '',
    chapter_name: item.chapter_name || '',
    chapter_title: item.chapter_title || '',
    chapter_path: item.chapter_path || '',
    server_image: domain_cdn,
    chapter_images: chapter_images,
  };
}

export async function fetchCategories(): Promise<Category[]> {
  const url = `${BASE_API_URL}/the-loai`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Không thể tải danh sách thể loại');
  const json = await res.json();
  if (json.status !== 'success') throw new Error(json.message || 'Lỗi API');
  return json.data.items || [];
}

export async function fetchMangaByCategory(slug: string, page: number = 1): Promise<ListResponse> {
  const url = `${BASE_API_URL}/the-loai/${slug}?page=${page}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Không thể tải danh sách thể loại');
  const json = await res.json();
  if (json.status !== 'success') throw new Error(json.message || 'Lỗi API');
  
  return {
    titlePage: json.data.titlePage || 'Thể loại',
    items: json.data.items || [],
    pagination: json.data.params.pagination,
    cdnImage: json.data.APP_DOMAIN_CDN_IMAGE || COVER_BASE_URL
  };
}

export async function searchManga(keyword: string, page: number = 1): Promise<ListResponse> {
  const url = `${BASE_API_URL}/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Tìm kiếm không phản hồi');
  const json = await res.json();
  if (json.status !== 'success') throw new Error(json.message || 'Lỗi API');
  
  return {
    titlePage: `Kết quả tìm kiếm cho: "${keyword}"`,
    items: json.data.items || [],
    pagination: json.data.params.pagination,
    cdnImage: json.data.APP_DOMAIN_CDN_IMAGE || COVER_BASE_URL
  };
}
