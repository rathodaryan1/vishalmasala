import { useState } from "react";
import { Grid2X2, Grid3X3, List, ChevronDown } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/products";

const sortOptions = ["Featured", "Price: Low to High", "Price: High to Low", "Newest"];

const Products = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase().trim() ?? "";
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(4);
  const [showSort, setShowSort] = useState(false);

  const filteredByCategory =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const filtered = searchQuery
    ? filteredByCategory.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery) ||
          product.description.toLowerCase().includes(searchQuery) ||
          product.category.toLowerCase().includes(searchQuery)
      )
    : filteredByCategory;

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.variants[0].price - b.variants[0].price;
    if (sortBy === "Price: High to Low") return b.variants[0].price - a.variants[0].price;
    return 0;
  });

  const gridClass =
    gridCols === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : gridCols === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Category Header */}
      <div className="bg-muted border-b border-border">
        <div className="container py-10 md:py-14 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">
            {selectedCategory === "All" ? "All Products" : selectedCategory}
          </h1>
          <p className="font-display text-lg font-semibold text-foreground mb-3">
            Savour the love, delight your senses!
          </p>
          <p className="font-body text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Delight your senses with Vishal Masala's finest spices, where each blend is made with care. Savour the love in every bite and enjoy the promise of flavour, quality, and authenticity.
          </p>
          {searchQuery && (
            <p className="mt-3 text-sm text-primary font-semibold">Search result for: "{searchQuery}"</p>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-border bg-background sticky top-16 md:top-20 z-40">
        <div className="container overflow-x-auto">
          <div className="flex gap-1 py-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-body text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="container">
        <div className="flex items-center justify-between py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setGridCols(2)}
              className={`p-1.5 rounded ${gridCols === 2 ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Grid2X2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setGridCols(3)}
              className={`p-1.5 rounded ${gridCols === 3 ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setGridCols(4)}
              className={`p-1.5 rounded ${gridCols === 4 ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="w-5 h-5" />
            </button>
            <span className="text-muted-foreground font-body text-sm ml-2">
              {sorted.length} products
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-2 font-body text-sm text-foreground border border-border rounded-lg px-3 py-2 hover:border-primary transition-colors"
            >
              Sort by: <span className="font-semibold">{sortBy}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showSort && (
              <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-50 min-w-[180px]">
                {sortOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setSortBy(opt); setShowSort(false); }}
                    className={`block w-full text-left px-4 py-2.5 font-body text-sm hover:bg-accent transition-colors ${
                      sortBy === opt ? "text-primary font-semibold" : "text-foreground"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container py-8">
        <div className={`grid ${gridClass} gap-5`}>
          {sorted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {sorted.length === 0 && (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-muted-foreground">No products found</p>
            <p className="font-body text-sm text-muted-foreground mt-2">
              Try selecting a different category.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Products;
