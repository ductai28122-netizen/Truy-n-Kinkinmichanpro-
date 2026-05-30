import { Link } from 'react-router-dom';
import { Category } from '../types';

interface CategoryListProps {
  categories: Category[];
  activeSlug?: string;
  onCategoryClick?: (slug: string) => void;
  layout?: 'grid' | 'scroll';
}

export default function CategoryList({
  categories,
  activeSlug,
  onCategoryClick,
  layout = 'grid',
}: CategoryListProps) {
  if (layout === 'scroll') {
    return (
      <div id="category-list-scroll" className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mask-image-horizontal">
        {categories.map((cat) => {
          const isActive = activeSlug === cat.slug;
          return onCategoryClick ? (
            <button
              id={`cat-chip-btn-${cat.slug}`}
              key={cat._id || cat.slug}
              onClick={() => onCategoryClick(cat.slug)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow shadow-purple-500/25'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-800/80 hover:border-zinc-700 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ) : (
            <Link
              id={`cat-chip-link-${cat.slug}`}
              key={cat._id || cat.slug}
              to={`/the-loai/${cat.slug}`}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-800/80 hover:border-zinc-700 hover:text-white'
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div id="category-list-grid" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {categories.map((cat) => {
        const isActive = activeSlug === cat.slug;
        return (
          <Link
            id={`cat-card-${cat.slug}`}
            key={cat._id || cat.slug}
            to={`/the-loai/${cat.slug}`}
            className={`flex items-center justify-center p-3 rounded-xl border text-sm font-semibold text-center transition-all ${
              isActive
                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white border-transparent shadow'
                : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-900 hover:border-zinc-800 hover:scale-[1.02] text-zinc-300 hover:text-purple-400'
            }`}
          >
            {cat.name}
          </Link>
        );
      })}
    </div>
  );
}
