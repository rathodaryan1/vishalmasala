import { Link } from "react-router-dom";

interface CategoryCardProps {
  title: string;
  image: string;
  itemCount?: number;
}

const CategoryCard = ({ title, image, itemCount }: CategoryCardProps) => {
  return (
    <Link
      to={`/products?category=${encodeURIComponent(title)}`}
      className="group relative bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col items-center text-center h-full animate-in fade-in slide-in-from-bottom-4 duration-700"
    >
      <div className="relative w-full aspect-square mb-6 flex items-center justify-center overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
        />
      </div>

      <div className="relative z-10 w-full mt-auto">
        <h3 className="font-display text-lg md:text-xl font-black text-[#1e1b4b] mb-2 group-hover:text-[#be1e2d] transition-colors leading-tight uppercase tracking-tight">
          {title}
        </h3>
        {itemCount !== undefined && (
          <p className="text-sm font-medium text-slate-500">
            {itemCount} items
          </p>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard;
