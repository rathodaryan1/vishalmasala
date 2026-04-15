import { describe, expect, it } from "vitest";
import { calculateCartTotals } from "@/lib/cart";

describe("calculateCartTotals", () => {
  it("computes subtotal, discount and total", () => {
    const result = calculateCartTotals([
      { productId: "chilli-powder", variantWeight: "100G", quantity: 2 },
      { productId: "garam-masala", variantWeight: "50G", quantity: 1 },
    ]);

    expect(result.subtotal).toBe(181);
    expect(result.total).toBe(164);
    expect(result.discount).toBe(17);
    expect(result.resolved).toHaveLength(2);
  });
});
