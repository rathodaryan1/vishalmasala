import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const Offers = () => {
  const offerProducts = products.filter((product) => product.isOffer);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="bg-muted border-b border-border">
        <div className="container py-12 text-center">
          <h1 className="font-display text-4xl font-bold">Special Offers</h1>
          <p className="text-muted-foreground mt-3">Limited-time deals from Vishal Masala.</p>
        </div>
      </div>
      <div className="container py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {offerProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Offers;
