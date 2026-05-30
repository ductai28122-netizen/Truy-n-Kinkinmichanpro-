export interface MangaItem {
  _id: string;
  name: string;
  slug: string;
  origin_name: string[];
  thumb_url: string;
  status: string;
  sub_doc_url: string;
  category: { name: string; slug: string }[];
  updatedAt: string;
  chaptersLatest?: {
    filename: string;
    chapter_name: string;
    chapter_title: string;
    chapter_api_data: string;
  }[];
}

export interface MangaDetail {
  _id: string;
  name: string;
  slug: string;
  origin_name: string[];
  content: string;
  status: string;
  thumb_url: string;
  author: string[];
  category: { name: string; slug: string }[];
  chapters: {
    server_name: string;
    server_data: {
      filename: string;
      chapter_name: string;
      chapter_title: string;
      chapter_api_data: string;
    }[];
  }[];
}

export interface ChapterImage {
  image_file: string;
  image_page: number;
}

export interface ChapterDetail {
  _id: string;
  comic_name: string;
  chapter_name: string;
  chapter_title: string;
  chapter_path: string;
  server_image: string;
  chapter_images: ChapterImage[];
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface HistoryItem {
  id: string;
  name: string;
  slug: string;
  thumb_url: string;
  chapter_name: string;
  chapter_title: string;
  chapter_api_data: string;
  updatedAt: number;
}

export interface FavoriteItem {
  id: string;
  name: string;
  slug: string;
  thumb_url: string;
  status: string;
  category: { name: string; slug: string }[];
  updatedAt: number;
}

export interface Pagination {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  pageRanges: number;
}
