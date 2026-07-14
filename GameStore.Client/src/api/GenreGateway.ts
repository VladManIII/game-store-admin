export type Genre = {
  id: number;
  name: string;
};

class GenreGateway {
  private readonly baseUrl = "/api";

  async getGenres(): Promise<Genre[]> {
    const response = await fetch(`${this.baseUrl}/genres`);
    if (!response.ok) {
      throw new Error(`API error ${response.status}`);
    }

    return (await response.json()) as Genre[];
  }
}

export const genreGateway = new GenreGateway();
