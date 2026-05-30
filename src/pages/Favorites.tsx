import { useEffect, useState } from 'react';
import { Heart, Hash, Sparkles } from 'lucide-react';
import { FavoriteItem } from '../types';
import { getFavorites } from '../utils/manga_helpers';
import MangaGrid from '../components/MangaGrid';
import EmptyState from '../components/EmptyState';

export default function Favorites() {
  const [favoritesList, setFavoritesList] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    setFavoritesList(getFavorites());
  }, []);

  return (
    <div id="favorites-page" className="min-h-screen bg-zinc-950 pt-3 sm:pt-6 pb-16 text-zinc-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
        
        {/* Title metadata segment */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Tủ sách sở thích
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-100 mt-1 font-sans VietnameseFont flex items-center gap-2">
              Danh Sách Yêu Thích
            </h1>
            <p className="text-zinc-500 text-xs sm:text-sm mt-1 max-w-xl">
              Nơi lưu trữ những bộ truyện tranh đỉnh cao đầy kỉ niệm do chính bạn yêu thích lựa chọn tại Kinkin Michan Truyện. 
            </p>
          </div>

          {favoritesList.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-850 text-xs font-semibold text-zinc-400">
              <Hash className="w-4 h-4 text-purple-400 animate-pulse" />
              Yêu thích: <span className="text-zinc-250 font-black">{favoritesList.length}</span> truyện
            </div>
          )}
        </div>

        {/* Content list panel representing saved bookmarks */}
        {favoritesList.length > 0 ? (
          <div className="space-y-4">
            <MangaGrid comics={favoritesList} />
          </div>
        ) : (
          <EmptyState
            title="Tủ sách yêu thích trống trơn"
            description="Bạn chưa lưu bộ truyện nào vào tủ sách yêu thích cá nhân cả. Nhấn nút hình trái tim trong trang chi tiết của bộ truyện bất kỳ để đánh dấu nhé!"
            actionLabel="Tìm truyện hay"
            actionPath="/"
          />
        )}
      </div>
    </div>
  );
}
