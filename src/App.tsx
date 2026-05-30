import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages imports
import Home from './pages/Home';
import MangaList from './pages/MangaList';
import Categories from './pages/Categories';
import CategoryDetail from './pages/CategoryDetail';
import Search from './pages/Search';
import MangaDetailView from './pages/MangaDetail';
import Reader from './pages/Reader';
import History from './pages/History';
import Favorites from './pages/Favorites';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-zinc-950 font-sans antialiased text-zinc-200">
          {/* Global Header */}
          <Header />

          {/* Core Page content wrapper */}
          <div className="flex-grow pt-14 sm:pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              
              {/* Category-based lists */}
              <Route path="/truyen-moi" element={<MangaList typeList="truyen-moi" title="Truyện Mới Cập Nhật" />} />
              <Route path="/hoan-thanh" element={<MangaList typeList="hoan-thanh" title="Truyện Đã Hoàn Thành" />} />
              <Route path="/dang-phat-hanh" element={<MangaList typeList="dang-phat-hanh" title="Truyện Đang Phát Hành" />} />
              <Route path="/sap-ra-mat" element={<MangaList typeList="sap-ra-mat" title="Truyện Sắp Ra Mắt" />} />

              {/* Genre directory & detail list */}
              <Route path="/the-loai" element={<Categories />} />
              <Route path="/the-loai/:slug" element={<CategoryDetail />} />

              {/* Global Search page */}
              <Route path="/tim-kiem" element={<Search />} />

              {/* Comic detail info pages */}
              <Route path="/truyen/:slug" element={<MangaDetailView />} />

              {/* Interactive reading page */}
              <Route path="/doc-truyen/:slug/:chapter" element={<Reader />} />

              {/* Personal locker drawers */}
              <Route path="/lich-su" element={<History />} />
              <Route path="/yeu-thich" element={<Favorites />} />

              {/* Catch-all 404 path redirects to home page */}
              <Route path="*" element={<Home />} />
            </Routes>
          </div>

          {/* Global Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}
