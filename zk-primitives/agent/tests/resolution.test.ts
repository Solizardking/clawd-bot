/**
 * Package-resolution smoke: imports the real workspace @clawd/zk-client
 * (not mocked) to prove pnpm workspace + exports + dist build work.
 */
import { describe, expect, test } from "vitest";
import {
  DEFAULT_PROGRAM_ID,
  computeNullifier,
  packPublicInputs,
} from "@clawd/zk-client";

describe("@clawd/zk-client workspace resolution", () => {
  test("exports DEFAULT_PROGRAM_ID as a valid PublicKey", () => {
    expect(DEFAULT_PROGRAM_ID.toBase58()).toMatch(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/);
  });

  test("computeNullifier is deterministic for the same inputs", async () => {
    const secret = new Uint8Array(32).fill(7);
    const context = "oss-resolution-smoke";
    const a = await computeNullifier({ secret, context });
    const b = await computeNullifier({ secret, context });
    expect(a).toHaveLength(32);
    expect(Array.from(a)).toEqual(Array.from(b));
  });

  test("packPublicInputs accepts four 32-byte fields", () => {
    const field = new Uint8Array(32);
    const packed = packPublicInputs([field, field, field, field]);
    expect(packed.byteLength).toBe(128);
  });
});
