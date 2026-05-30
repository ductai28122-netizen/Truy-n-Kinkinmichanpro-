import { Link } from 'react-router-dom';
import { BookOpen, Github, Mail, ShieldAlert } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400 py-10 px-4 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        
        {/* Brand description info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
            <span className="text-base font-bold text-zinc-100">Kinkin Michan Truyện</span>
          </div>
          <p className="text-xs leading-relaxed text-zinc-400">
            Website đọc truyện tranh trực tuyến chất lượng cao, cập nhật chương mới liên tục hàng ngày từ nhiều nguồn phong phú. Phong cách hiện đại, tốc độ tải nhanh và giao diện tối ưu hàng đầu.
          </p>
        </div>

        {/* Quick access links */}
        <div id="footer-links-grid" className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider mb-3">Hệ thống</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-purple-400 transition-colors">Trang chủ</Link>
              </li>
              <li>
                <Link to="/truyen-moi" className="hover:text-purple-400 transition-colors">Truyện mới</Link>
              </li>
              <li>
                <Link to="/the-loai" className="hover:text-purple-400 transition-colors">Thể loại</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider mb-3">Tài nguyên</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/lich-su" className="hover:text-purple-400 transition-colors">Lịch sử đọc</Link>
              </li>
              <li>
                <Link to="/yeu-thich" className="hover:text-purple-400 transition-colors">Truyện yêu thích</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal disclaimer */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            Bản quyền & Tuyên bố miễn trừ
          </h4>
          <p className="text-[11px] leading-relaxed text-zinc-500">
            Toàn bộ nội dung truyện tranh trên website được tự động cập nhật và chia sẻ phi lợi nhuận từ các nguồn tài nguyên công cộng. Chúng tôi không lưu trữ bất kỳ dữ liệu nào trên máy chủ riêng. Bản quyền tác phẩm thuộc về tác giả gốc và nhà xuất bản.
          </p>
        </div>
      </div>

      <hr className="border-zinc-900 my-6" />

      {/* Trademark/Copyright text */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
        <p>© {currentYear} Kinkin Michan Truyện. Thiết lập phi thương mại dành cho cộng đồng đọc giả.</p>
        <div className="flex items-center gap-4 text-zinc-500">
          <span className="flex items-center gap-1.5 hover:text-zinc-300 cursor-pointer">
            <Mail className="w-3.5 h-3.5" />
            kinkin-manga@google.com
          </span>
        </div>
      </div>
    </footer>
  );
}
