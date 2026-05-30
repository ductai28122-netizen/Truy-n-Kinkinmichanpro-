import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearchChange?: (val: string) => void;
  isSearching?: boolean;
}

export default function SearchBar({
  placeholder = 'Tìm truyện, tác giả, thể loại...',
  className = '',
  onSearchChange,
  isSearching = false,
}: SearchBarProps) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('keyword') || '');
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync state if query params change externally
  useEffect(() => {
    const keyword = params.get('keyword') || '';
    setQuery(keyword);
  }, [params]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/tim-kiem?keyword=${encodeURIComponent(query.trim())}`);
  };

  const handleClear = () => {
    setQuery('');
    if (onSearchChange) {
      onSearchChange('');
    }
    inputRef.current?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  return (
    <form
      id="search-bar-form"
      onSubmit={handleSubmit}
      className={`relative flex items-center w-full group ${className}`}
    >
      <input
        id="search-input"
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full h-11 pl-11 pr-10 rounded-xl bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-800 focus:border-purple-500/80 text-sm font-medium text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-purple-500/20 shadow-inner transition-all duration-300"
      />
      
      {/* Search status indicator or simple magnifying glass */}
      <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-zinc-500 group-focus-within:text-purple-400 transition-colors z-20">
        {isSearching ? (
          <Loader2 className="w-4.5 h-4.5 animate-spin" />
        ) : (
          <Search className="w-4.5 h-4.5" />
        )}
      </div>

      {query && (
        <button
          id="search-clear-btn"
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer"
        >
          <X className="w-4.5 h-4.5" />
        </button>
      )}
    </form>
  );
}
