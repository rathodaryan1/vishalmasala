import blendedSpices from "@/assets/blended-spices.jpg";
import pureSpices from "@/assets/pure-spices.jpg";
import asafoetida from "@/assets/asafoetida.jpg";
import exoticSpices from "@/assets/exotic-spices.jpg";
import pastes from "@/assets/pastes.jpg";
import { getImageUrl } from "@/lib/utils";

const categories = [
  {
    title: "Blended Spices",
    description: "Hand-crafted blends sourced from India's renowned spice lands, ensuring uncompromised taste, aroma & color.",
    image: blendedSpices,
  },
  {
    title: "Pure Spices",
    description: "Rich & authentic pure spices that occupy a special place of honor in every Indian kitchen.",
    image: pureSpices,
  },
  {
    title: "Asafoetida",
    description: "Rich, strong and soothing Hingraj Powder made using spices of the highest quality from the best farms.",
    image: asafoetida,
  },
  {
    title: "Exotic Range",
    description: "Premium Kesar, Saffron and aromatic spice mixes for traditional and mouth-watering shahi Indian feasts.",
    image: exoticSpices,
  },
  {
    title: "Pastes",
    description: "Fresh & delicious ginger garlic paste and blended delights, a must have for food preparation.",
    image: pastes,
  },
];

const ProductCategories = () => {
  return (
    <section id="products" className="py-16 md:py-24 bg-accent">
      <div className="container">
        <div className="text-center mb-12">
          <p className="font-body text-primary text-sm font-semibold tracking-widest uppercase mb-2">
            Our Collection
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Products You Will Love
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer bg-card"
            >
              <div className="h-56 overflow-hidden">
                <img
                  src={getImageUrl(cat.image)}
                  alt={cat.title}
                  className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  width={640}
                  height={640}
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {cat.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3">
                  {cat.description}
                </p>
                <span className="font-body text-primary text-sm font-semibold group-hover:underline">
                  View More →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
