import { describe, it, expect } from "vitest";

// route.ts:14 does `parseInt(job_price, 10)` on the raw form-data string
// before it flows into the Stripe unit_amount calculation. This is a real
// bug (silent truncation of decimal prices, and NaN for a missing/
// non-numeric value) that this PR intentionally does NOT fix, since
// changing charging logic isn't safe in a test-only change. Testing the
// route handler end-to-end would require mocking Next's request/response,
// Clerk, and the db layer just to reach this one line, so instead this
// documents the exact expression's current (buggy) behavior directly.
// See the PR's "Notes / possible bugs spotted" section.
describe("create-checkout-session job_price parsing (documents an existing bug, not desired behavior)", () => {
  it("truncates a decimal job price instead of rounding it", () => {
    expect(parseInt("150.50", 10)).toBe(150);
  });

  it("produces NaN for a missing or non-numeric job_price", () => {
    expect(Number.isNaN(parseInt("", 10))).toBe(true);
    expect(Number.isNaN(parseInt("abc", 10))).toBe(true);
  });
});
