import { MangaItem } from '../types';
import MangaCard from './MangaCard';

interface MangaGridProps {
  comics: (MangaItem | {
    _id: string;
    name: string;
    slug: string;
    thumb_url: string;
    status: string;
    category?: { name: string; slug: string }[];
    updatedAt?: string | number;
  })[];
  cdnImage?: string;
  className?: string;
}

export default function MangaGrid({ comics, cdnImage, className }: MangaGridProps) {
  return (
    <div id="manga-grid" className={className || "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6"}>
      {comics.map((comic, index) => (
        <MangaCard 
          key={comic._id || comic.slug || index} 
          manga={comic} 
          cdnImage={cdnImage} 
          index={index} 
        />
      ))}
    </div>
  );
}
