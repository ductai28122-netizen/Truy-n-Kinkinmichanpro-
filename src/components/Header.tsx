import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, Heart, History, Compass, Film, Flame } from 'lucide-react';
import SearchBar from './SearchBar';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Entirely hide or collapse main header when in reader page to maximize mobile readability
  const isReaderPage = location.pathname.startsWith('/doc-truyen/');
  if (isReaderPage) {
    return null;
  }

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navItems = [
    { label: 'Trang chủ', path: '/', icon: <Compass className="w-4 h-4" /> },
    { label: 'Truyện mới', path: '/truyen-moi', icon: <Flame className="w-4 h-4" /> },
    { label: 'Thể loại', path: '/the-loai', icon: <Film className="w-4 h-4" /> },
    { label: 'Yêu thích', path: '/yeu-thich', icon: <Heart className="w-4 h-4" /> },
    { label: 'Lịch sử', path: '/lich-su', icon: <History className="w-4 h-4" /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
        
        {/* Branding Logo */}
        <Link 
          id="brand-logo-link"
          to="/" 
          onClick={closeMenu}
          className="flex items-center gap-2 group flex-shrink-0 cursor-pointer"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-rose-500 flex items-center justify-center text-white shadow shadow-purple-500/30 group-hover:rotate-12 duration-300">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="text-base sm:text-lg md:text-xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent group-hover:brightness-110 active:scale-98 transition-all tracking-tight VietnameseFont">
            Kinkin Michan Truyện
          </span>
        </Link>

        {/* Search Input block (hidden on narrow screens in the center, rendered styled) */}
        <div className="hidden md:block flex-grow max-w-md">
          <SearchBar />
        </div>

        {/* Regular Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              id={`nav-${item.path.replace('/', '') || 'home'}`}
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-purple-900/30 text-purple-400 border border-purple-500/10'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-900/40 border border-transparent'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile controls: Search toggle and hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile hamburger menu toggle */}
          <button
            id="mobile-menu-toggle"
            onClick={toggleMenu}
            className="p-2 bg-zinc-900 rounded-xl text-zinc-400 hover:text-white border border-zinc-800 focus:outline-none transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div id="mobile-drawer" className="lg:hidden absolute top-14 sm:top-16 left-0 right-0 bg-zinc-950 border-b border-zinc-900 p-4 space-y-4 shadow-2xl transition-all duration-300">
          {/* Interactive Search inside Mobile Drawer */}
          <div className="pt-1">
            <SearchBar placeholder="Tìm kiếm truyện tại Kinkin..." onSearchChange={() => {}} />
          </div>
          
          <nav className="flex flex-col gap-1.5 pb-2">
            {navItems.map((item) => (
              <NavLink
                id={`nav-mob-${item.path.replace('/', '') || 'home'}`}
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-900/40 to-pink-900/40 text-purple-300 border border-purple-500/20 shadow'
                      : 'text-zinc-300 hover:text-white bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-900'
                  }`
                }
              >
                <div className="text-purple-400">{item.icon}</div>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
