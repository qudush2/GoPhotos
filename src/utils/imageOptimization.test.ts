import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// CLOUDFRONT_DOMAIN_OPTIMIZED is read from process.env into a module-level
// const at import time, so we set the env var and dynamically import the
// module fresh in each test rather than relying on a static top-level
// import. We don't assert against any particular real domain, only against
// the value we set ourselves.
describe("getImageUrl", () => {
  const originalCloudfrontDomain = process.env.CLOUDFRONT_DOMAIN_OPTIMIZED;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    // vi.resetModules() only clears module state; it does not restore
    // process.env, so restore it ourselves to avoid leaking a fake domain
    // into other test files that run in the same worker.
    if (originalCloudfrontDomain === undefined) {
      delete process.env.CLOUDFRONT_DOMAIN_OPTIMIZED;
    } else {
      process.env.CLOUDFRONT_DOMAIN_OPTIMIZED = originalCloudfrontDomain;
    }
  });

  it("omits width and height from the query string when they are not provided", async () => {
    process.env.CLOUDFRONT_DOMAIN_OPTIMIZED = "test.cloudfront.net";
    const { getImageUrl } = await import("./imageOptimization");

    const url = getImageUrl("photos/key.jpg");
    const [base, query] = url.split("?");
    const params = new URLSearchParams(query);

    expect(base).toBe("https://test.cloudfront.net/photos/key.jpg");
    expect(params.has("width")).toBe(false);
    expect(params.has("height")).toBe(false);
    expect(params.get("format")).toBe("auto");
    expect(params.get("quality")).toBe("auto");
  });

  it("includes width and height when provided, and stringifies a numeric quality", async () => {
    process.env.CLOUDFRONT_DOMAIN_OPTIMIZED = "test.cloudfront.net";
    const { getImageUrl } = await import("./imageOptimization");

    const url = getImageUrl("photos/key.jpg", 800, 600, "webp", 80);
    const params = new URLSearchParams(url.split("?")[1]);

    expect(params.get("width")).toBe("800");
    expect(params.get("height")).toBe("600");
    expect(params.get("format")).toBe("webp");
    expect(params.get("quality")).toBe("80");
  });
});
