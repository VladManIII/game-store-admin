export type Game = {
  id: number;
  name: string;
  genre: string;
  price: number;
  releaseDate: string;
};

export type GameDetails = {
  id: number;
  name: string;
  genreId: number;
  price: number;
  releaseDate: string;
};

export type NewGame = {
  name: string;
  genreId: number;
  price: number;
  releaseDate: string;
};

export type UpdateGame = NewGame;

class GamesGateway {
  private readonly baseUrl = "/api";

  async getGames(): Promise<Game[]> {
    const response = await fetch(`${this.baseUrl}/games`);
    if (!response.ok) {
      throw new Error(`API error ${response.status}`);
    }

    return (await response.json()) as Game[];
  }

  async getGame(id: number): Promise<GameDetails> {
    const response = await fetch(`${this.baseUrl}/games/${id}`);
    if (!response.ok) {
      throw new Error(`API error ${response.status}`);
    }

    return (await response.json()) as GameDetails;
  }

  async addGame(newGame: NewGame): Promise<GameDetails> {
    const response = await fetch(`${this.baseUrl}/games`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGame),
    });
    if (!response.ok) {
      throw new Error(`API error ${response.status}`);
    }

    return (await response.json()) as GameDetails;
  }

  async updateGame(id: number, updateGame: UpdateGame): Promise<void> {
    const response = await fetch(`${this.baseUrl}/games/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateGame),
    });
    if (!response.ok) {
      throw new Error(`API error ${response.status}`);
    }
  }

  async deleteGame(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/games/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`API error ${response.status}`);
    }
  }
}

export const gamesGateway = new GamesGateway();
