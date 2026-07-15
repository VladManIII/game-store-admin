import { beforeEach, describe, expect, it, vi } from "vitest";
import { gamesGateway } from "./GamesGateway.js";

function jsonResponse(body: unknown, status = 200) {
  return new Response(status === 204 ? null : JSON.stringify(body), {
    status,
    headers:
      status === 204 ? undefined : { "Content-Type": "application/json" },
  });
}

describe("GamesGateway", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("getGames sends a GET to /api/games and returns the parsed list", async () => {
    const games = [
      {
        id: 1,
        name: "Gothic",
        genre: "RPG",
        price: 20,
        releaseDate: "2001-04-15",
      },
    ];
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(games));

    const result = await gamesGateway.getGames();

    expect(fetch).toHaveBeenCalledWith("/api/games", undefined);
    expect(result).toEqual(games);
  });

  it("addGame sends a POST with a JSON body", async () => {
    const newGame = {
      name: "New Game",
      genreId: 1,
      price: 10,
      releaseDate: "2024-01-01",
    };
    const created = { id: 5, ...newGame };
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(created, 201));

    const result = await gamesGateway.addGame(newGame);

    expect(fetch).toHaveBeenCalledWith(
      "/api/games",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGame),
      }),
    );

    expect(result).toEqual(created);
  });

  it("deleteGame resolves without a body on a 204 response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(null, 204));

    await expect(gamesGateway.deleteGame(1)).resolves.toBeUndefined();
  });

  it("throws when the response is not ok", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(null, 500));

    await expect(gamesGateway.getGames()).rejects.toThrow("API error 500");
  });
});
