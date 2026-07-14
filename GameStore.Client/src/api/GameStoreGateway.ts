export type Game = {
  id: number;
  name: string;
  genre: string;
  price: number;
  releaseDate: string;
};

class GameStoreGateway {
  private readonly baseUrl = "/api";

  async getGames(): Promise<Game[]> {
    const response = await fetch(`${this.baseUrl}/games`);
    if (!response.ok) {
      throw new Error(`API error ${response.status}`);
    }

    return (await response.json()) as Game[];
  }
}

export const gameStoreGateway = new GameStoreGateway();
