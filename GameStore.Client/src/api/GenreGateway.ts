import { httpClient } from "./httpClient.js";

export type Genre = {
  id: number;
  name: string;
};

class GenreGateway {
  async getGenres(): Promise<Genre[]> {
    return httpClient.get<Genre[]>("/genres");
  }
}

export const genreGateway = new GenreGateway();
