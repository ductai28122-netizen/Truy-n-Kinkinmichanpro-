import { useEffect, useState } from 'react';
import { Sparkles, Hash } from 'lucide-react';
import { Category } from '../types';
import { fetchCategories } from '../api/otruyen';
import CategoryList from '../components/CategoryList';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await fetchCategories();
      setCategories(list);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách thể loại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div id="categories-page" className="min-h-screen bg-zinc-950 pt-3 sm:pt-6 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
        
        {/* Title metadata header */}
        <div className="border-b border-zinc-900 pb-5">
          <span className="text-xs uppercase font-extrabold tracking-wider bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            Khám phá theo nội dung
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-100 mt-1 font-sans VietnameseFont">
            Thể Loại Truyện Tranh
          </h1>
          <p className="text-zinc-500 text-sm mt-1 max-w-xl">
            Tìm kiếm truyện yêu thích theo nội dung bằng cách nhấn vào thể loại bạn quan tâm tại Kinkin Michan Truyện. 
          </p>
        </div>

        {/* Categories container */}
        {error ? (
          <ErrorState message={error} onRetry={loadCategories} />
        ) : loading ? (
          <LoadingSkeleton type="category" />
        ) : categories.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-zinc-400">
              <Hash className="w-4 h-4 text-purple-400" />
              Tổng cộng có <span className="text-zinc-200">{categories.length}</span> nhóm thể loại khác nhau
            </div>
            <CategoryList categories={categories} />
          </div>
        ) : (
          <div className="text-center text-zinc-500 py-12 bg-zinc-900/10 rounded-xl border border-zinc-900">
            Không có dữ liệu thể loại hiện khả dụng.
          </div>
        )}
      </div>
    </div>
  );
}
