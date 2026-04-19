import { Link } from "react-router-dom";
import { getImageUrl } from "@/lib/utils";

interface CategoryCardProps {
  name: string;
  image: string;
  count?: number;
}

const CategoryCard = ({ name, image, count }: CategoryCardProps) => {
  return (
    <Link
      to={`/products?category=${encodeURIComponent(name.toUpperCase())}`}
      className="group relative flex flex-col items-center bg-white border-2 border-slate-50 rounded-[2.5rem] p-6 text-center hover:shadow-2xl transition-all hover:-translate-y-2"
    >
      <div className="w-full aspect-square rounded-[2rem] bg-slate-50 mb-6 flex items-center justify-center overflow-hidden">
        <img
          src={getImageUrl(image)}
          alt={name}
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="relative z-10 w-full mt-auto">
        <h3 className="font-display text-lg md:text-xl font-black text-[#1e1b4b] mb-2 group-hover:text-[#be1e2d] transition-colors leading-tight uppercase tracking-tight">
          {name}
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
