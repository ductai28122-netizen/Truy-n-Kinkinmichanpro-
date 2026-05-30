import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Compass, BookOpen, Clock, Heart, ArrowRight, Star, Flame, Sparkles, CheckCircle, HelpCircle } from 'lucide-react';
import { MangaItem } from '../types';
import { fetchMangaList } from '../api/otruyen';
import { getMangaCoverUrl } from '../utils/manga_helpers';
import MangaGrid from '../components/MangaGrid';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';

export default function Home() {
  const [newComics, setNewComics] = useState<MangaItem[]>([]);
  const [hotComics, setHotComics] = useState<MangaItem[]>([]);
  const [completedComics, setCompletedComics] = useState<MangaItem[]>([]);
  const [ongoingComics, setOngoingComics] = useState<MangaItem[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cdnImage, setCdnImage] = useState<string>('');

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Concurrently fetch different lists for high performance
      const [newRes, hotRes, compRes, ongoingRes] = await Promise.all([
        fetchMangaList('truyen-moi', 1),
        fetchMangaList('dang-phat-hanh', 1), // use ongoing as hot proxy
        fetchMangaList('hoan-thanh', 1),
        fetchMangaList('sap-ra-mat', 1) // upcoming
      ].map(p => p.catch(err => {
        console.error("Fetch sub-error ignored", err);
        return null;
      })));

      if (newRes) {
        setNewComics(newRes.items.slice(0, 12));
        setCdnImage(newRes.cdnImage);
      }
      if (hotRes) {
        setHotComics(hotRes.items.slice(0, 6));
      }
      if (compRes) {
        setCompletedComics(compRes.items.slice(0, 6));
      }
      if (ongoingRes) {
        setOngoingComics(ongoingRes.items.slice(0, 6));
      }

      if (!newRes && !hotRes && !compRes && !ongoingRes) {
        throw new Error("Không thể tải toàn bộ dữ liệu. Kết nối API khả dụng có vấn đề.");
      }
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra khi tải dữ liệu từ API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24 min-h-screen">
        <ErrorState message={error} onRetry={loadHomeData} />
      </div>
    );
  }

  // Choose index 1 or 2 as banner if available, for beautiful cover art
  const heroManga = hotComics[0] || newComics[0];

  return (
    <div id="home-page" className="min-h-screen bg-zinc-950 pb-16">
      
      {/* Banner Area */}
      <section className="relative w-full overflow-hidden pt-14 -mt-14 sm:pt-16 sm:-mt-16">
        {loading ? (
          <div className="container mx-auto px-4 pt-20 md:pt-24 pb-8">
            <LoadingSkeleton type="banner" />
          </div>
        ) : heroManga ? (
          <div className="relative w-full bg-zinc-950 text-white border-b border-zinc-900">
            {/* Blurry cinematic backdrop image */}
            <div className="absolute inset-x-0 top-0 h-full overflow-hidden bg-black">
              <img
                src={getMangaCoverUrl(heroManga.thumb_url, cdnImage)}
                alt=""
                className="w-full h-full object-cover blur-2xl opacity-20 scale-125"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            </div>

            {/* Content box */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24 flex flex-col md:flex-row gap-8 items-center">
              {/* Cover card in Hero */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-48 sm:w-56 md:w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-purple-500/10 flex-shrink-0 z-10"
              >
                <img
                  src={getMangaCoverUrl(heroManga.thumb_url, cdnImage)}
                  alt={heroManga.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=350&auto=format&fit=crop';
                  }}
                />
              </motion.div>

              {/* Text introduction */}
              <div className="flex-grow space-y-4 text-center md:text-left z-10">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/25 rounded-full text-xs font-bold text-purple-300">
                    <Sparkles className="w-4.5 h-4.5 text-pink-400 animate-pulse" />
                    Đang Trở Nên Thịnh Hành
                  </span>
                  
                  {heroManga.status && (
                    <span className="px-3 py-1 bg-zinc-900 border border-zinc-805 rounded-full text-xs font-medium text-zinc-400">
                      Chương {heroManga.chaptersLatest?.[0]?.chapter_name || '1'} mới nhất
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-zinc-50 tracking-tight VietnameseFont leading-tight max-w-3xl">
                  {heroManga.name}
                </h1>

                {heroManga.category && Array.isArray(heroManga.category) && (
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
                    {heroManga.category.slice(0, 4).map((cat) => (
                      <Link
                        id={`hero-cat-tag-${cat.slug}`}
                        key={cat.slug}
                        to={`/the-loai/${cat.slug}`}
                        className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-zinc-900/40 hover:bg-zinc-800 border border-zinc-900 text-zinc-400 hover:text-purple-400 hover:border-zinc-800 transition-all cursor-pointer"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}

                <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl line-clamp-3">
                  Cập nhật chương mới nhất tại website Kinkin Michan Truyện. Trải nghiệm tốc độ load cực nhanh, tính năng lưu trữ lịch sử cá nhân hóa và đồng bộ yêu thích mượt mà ngay trên mọi thiết bị.
                </p>

                {/* Primary Button controls */}
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3.5 pt-4">
                  <Link
                    id="hero-read-first-btn"
                    to={`/truyen/${heroManga.slug}`}
                    className="flex items-center justify-center gap-2 px-7 py-3 w-full sm:w-auto rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:brightness-110 shadow-lg shadow-purple-500/20 active:scale-98 transition-all cursor-pointer"
                  >
                    <BookOpen className="w-4.5 h-4.5" />
                    Xem Chi Tiết
                  </Link>

                  {heroManga.chaptersLatest?.[0] && (
                    <Link
                      id="hero-read-latest-btn"
                      to={`/doc-truyen/${heroManga.slug}/${heroManga.chaptersLatest[0].chapter_name}?api=${encodeURIComponent(heroManga.chaptersLatest[0].chapter_api_data)}`}
                      state={{ chapterApiUrl: heroManga.chaptersLatest[0].chapter_api_data }}
                      className="flex items-center justify-center gap-2 px-6 py-3 w-full sm:w-auto rounded-xl text-sm font-bold text-zinc-200 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 hover:text-purple-400 transition-all cursor-pointer"
                    >
                      Đọc Chương {heroManga.chaptersLatest[0].chapter_name}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {/* Grid Collections section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12">
        
        {/* Truyen moi cap nhat */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
            <h2 className="text-base sm:text-2xl font-black text-zinc-100 flex items-center gap-2">
              <span className="w-1 h-5 sm:w-1.5 sm:h-6 bg-gradient-to-t from-purple-600 to-pink-500 rounded-full" />
              Truyện mới cập nhật
            </h2>
            <Link
              id="view-all-new"
              to="/truyen-moi"
              className="group text-xs sm:text-sm font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              Xem tất cả
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 duration-200" />
            </Link>
          </div>

          {loading ? (
            <LoadingSkeleton count={12} />
          ) : newComics.length > 0 ? (
            <MangaGrid comics={newComics} cdnImage={cdnImage} />
          ) : (
            <p className="text-zinc-500 text-sm">Không tìm thấy truyện mới.</p>
          )}
        </section>

        {/* Truyen Hot - (Ongoing proxy list) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
            <h2 className="text-base sm:text-2xl font-black text-zinc-100 flex items-center gap-2">
              <span className="w-1 h-5 sm:w-1.5 sm:h-6 bg-gradient-to-t from-orange-500 to-amber-500 rounded-full" />
              Truyện Hot đọc nhiều
            </h2>
            <Link
              id="view-all-hot"
              to="/dang-phat-hanh"
              className="group text-xs sm:text-sm font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              Xem tất cả
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 duration-200" />
            </Link>
          </div>

          {loading ? (
            <LoadingSkeleton count={6} />
          ) : hotComics.length > 0 ? (
            <MangaGrid comics={hotComics} cdnImage={cdnImage} />
          ) : (
            <p className="text-zinc-500 text-sm">Không tìm thấy danh sách truyện hot.</p>
          )}
        </section>

        {/* Bottom double rows layout - Truyen Hoan thanh & Truyen dang phat hanh */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          
          {/* Section Truyen hoan thanh */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
              <h2 className="text-base sm:text-xl font-black text-zinc-100 flex items-center gap-2">
                <CheckCircle className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-purple-400" />
                Truyện hoàn thành
              </h2>
              <Link
                id="view-all-completed"
                to="/hoan-thanh"
                className="group text-xs sm:text-sm font-bold text-zinc-400 hover:text-purple-400 flex items-center gap-1 transition-colors cursor-pointer"
              >
                Tất cả
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 duration-200" />
              </Link>
            </div>

            {loading ? (
              <LoadingSkeleton count={4} />
            ) : completedComics.length > 0 ? (
              <MangaGrid 
                comics={completedComics.slice(0, 4)} 
                cdnImage={cdnImage} 
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6"
              />
            ) : (
              <p className="text-zinc-500 text-sm">Chưa có dữ liệu.</p>
            )}
          </section>

          {/* Section Truyen dang phat hanh */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
              <h2 className="text-base sm:text-xl font-black text-zinc-100 flex items-center gap-2">
                <Clock className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-emerald-400 animate-pulse" />
                Truyện sắp ra mắt
              </h2>
              <Link
                id="view-all-ongoing"
                to="/sap-ra-mat"
                className="group text-xs sm:text-sm font-bold text-zinc-400 hover:text-purple-400 flex items-center gap-1 transition-colors cursor-pointer"
              >
                Tất cả
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 duration-200" />
              </Link>
            </div>

            {loading ? (
              <LoadingSkeleton count={4} />
            ) : ongoingComics.length > 0 ? (
              <MangaGrid 
                comics={ongoingComics.slice(0, 4)} 
                cdnImage={cdnImage} 
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6"
              />
            ) : (
              <p className="text-zinc-500 text-sm">Chưa có dữ liệu.</p>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}
