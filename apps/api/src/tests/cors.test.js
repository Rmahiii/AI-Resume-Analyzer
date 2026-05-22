import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../app.js";

describe("production CORS", () => {
  it("allows the Vercel frontend preflight before API routes", async () => {
    const response = await request(app)
      .options("/api/v1/auth/login")
      .set("Origin", "https://ai-resume-analyzer-web-six.vercel.app")
      .set("Access-Control-Request-Method", "POST")
      .set("Access-Control-Request-Headers", "Content-Type,Authorization");

    expect(response.status).toBe(204);
    expect(response.headers["access-control-allow-origin"])
      .toBe("https://ai-resume-analyzer-web-six.vercel.app");
    expect(response.headers["access-control-allow-credentials"]).toBe("true");
    expect(response.headers["access-control-allow-methods"])
      .toContain("PATCH");
    expect(response.headers["access-control-allow-headers"])
      .toBe("Content-Type,Authorization");
  });
});
