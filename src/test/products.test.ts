import { describe, expect, it } from "vitest";
import { getProductById, getRelatedProducts } from "@/data/products";

describe("product helpers", () => {
  it("returns a product by id", () => {
    expect(getProductById("chilli-powder")?.name).toBe("Chilli Powder");
  });

  it("returns related products from same category", () => {
    const related = getRelatedProducts("chilli-powder");
    expect(related.length).toBeGreaterThan(0);
    expect(related.every((product) => product.category === "Basic Spices")).toBe(true);
  });
});
