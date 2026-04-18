import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useShop } from "@/context/ShopContext";

const Offers = () => {
  const { products, loadingProducts } = useShop();
  
  // Dynamic filter: Show products with any variant having a discount or marked as offer
  const offerProducts = products.filter((product) => {
    return product.isOffer || product.variants.some(v => v.originalPrice > v.price);
  });

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
        {loadingProducts ? (
          <div className="text-center py-20 font-display text-2xl text-muted-foreground">
            Loading offers...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {offerProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Offers;
