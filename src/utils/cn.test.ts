import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("joins truthy class names with a space", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("filters out falsy values (undefined, null, false, empty string, 0)", () => {
    expect(cn("a", undefined, null, false, "", 0, "b")).toBe("a b");
  });

  it("returns an empty string when given no arguments or all-falsy arguments", () => {
    expect(cn()).toBe("");
    expect(cn(false, undefined, null)).toBe("");
  });
});
