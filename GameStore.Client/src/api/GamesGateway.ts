import { httpClient } from "./httpClient.js";

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
  async getGames(): Promise<Game[]> {
    return httpClient.get<Game[]>("/games");
  }

  async getGame(id: number): Promise<GameDetails> {
    return httpClient.get<GameDetails>(`/games/${id}`);
  }

  async addGame(newGame: NewGame): Promise<GameDetails> {
    return httpClient.post<GameDetails>("/games", newGame);
  }

  async updateGame(id: number, updateGame: UpdateGame): Promise<void> {
    return httpClient.put<void>(`/games/${id}`, updateGame);
  }

  async deleteGame(id: number): Promise<void> {
    return httpClient.delete<void>(`/games/${id}`);
  }
}

export const gamesGateway = new GamesGateway();
