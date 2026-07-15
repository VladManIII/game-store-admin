import { beforeEach, describe, expect, it, vi } from "vitest";
import { genreGateway } from "./GenreGateway.js";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("GenreGateway", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("getGenres sends a GET to /api/genres and returns the parsed list", async () => {
    const genres = [{ id: 1, name: "RPG" }];
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(genres));

    const result = await genreGateway.getGenres();

    expect(fetch).toHaveBeenCalledWith("/api/genres", undefined);
    expect(result).toEqual(genres);
  });

  it("throws when the response is not ok", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(null, 404));

    await expect(genreGateway.getGenres()).rejects.toThrow("API error 404");
  });
});
