import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAccountByClerkId } from "@/src/utils/db";
import setupProductAndPrice from "./setup-product-price";

// setup-product-price.ts constructs `new Stripe(...)` from
// process.env.STRIPE_SECRET_KEY at import time, and looks up the
// photographer via @/src/utils/db. Both are mocked so no real Stripe key
// or database connection is ever needed, and no network call is made.
const { mockProductsCreate, mockPricesCreate } = vi.hoisted(() => ({
  mockProductsCreate: vi.fn(),
  mockPricesCreate: vi.fn(),
}));

vi.mock("stripe", () => ({
  default: vi.fn().mockImplementation(() => ({
    products: { create: mockProductsCreate },
    prices: { create: mockPricesCreate },
  })),
}));

vi.mock("@/src/utils/db", () => ({
  getAccountByClerkId: vi.fn(),
}));

describe("setupProductAndPrice", () => {
  beforeEach(() => {
    mockProductsCreate.mockReset().mockResolvedValue({ id: "prod_123" });
    mockPricesCreate.mockReset().mockResolvedValue({ id: "price_123" });
    vi.mocked(getAccountByClerkId)
      .mockReset()
      .mockResolvedValue({ full_name: "Jane Doe" } as any);
  });

  it("creates a Stripe product and price with the 10% GoPhotos fee applied, in cents", async () => {
    const result = await setupProductAndPrice(100, "Wedding", "pg_1", "convo_1");

    expect(mockProductsCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Jane Doe's Photography Service",
        metadata: { convoID: "convo_1", originalPrice: 100 },
      })
    );
    expect(mockPricesCreate).toHaveBeenCalledWith({
      product: "prod_123",
      unit_amount: 11000, // 100 * 100 * 1.1
      currency: "usd",
    });
    expect(result).toEqual({
      product: { id: "prod_123" },
      price: { id: "price_123" },
    });
  });

  it("rounds a fractional cent amount up at the .5 boundary (150.55 * 100 * 1.1 = 16560.5 -> 16561)", async () => {
    await setupProductAndPrice(150.55, "Wedding", "pg_1", "convo_1");

    expect(mockPricesCreate).toHaveBeenCalledWith(
      expect.objectContaining({ unit_amount: 16561 })
    );
  });

  it("rounds a fractional cent amount down below the .5 boundary (33.33 * 100 * 1.1 = 3666.3 -> 3666)", async () => {
    await setupProductAndPrice(33.33, "Wedding", "pg_1", "convo_1");

    expect(mockPricesCreate).toHaveBeenCalledWith(
      expect.objectContaining({ unit_amount: 3666 })
    );
  });

  it("passes the product id returned by products.create through to prices.create", async () => {
    mockProductsCreate.mockResolvedValueOnce({ id: "prod_special" });

    await setupProductAndPrice(50, "Portrait", "pg_2", "convo_2");

    expect(mockPricesCreate).toHaveBeenCalledWith(
      expect.objectContaining({ product: "prod_special" })
    );
  });
});
