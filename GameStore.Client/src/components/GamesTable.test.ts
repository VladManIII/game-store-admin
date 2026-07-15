import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import GamesTable from "./GamesTable.vue";
import { gamesGateway, type Game } from "../api/GamesGateway.js";
import { useToast } from "../composables/useToast.js";

vi.mock("../api/GamesGateway.js", () => ({
  gamesGateway: {
    getGames: vi.fn(),
    getGame: vi.fn(),
    addGame: vi.fn(),
    updateGame: vi.fn(),
    deleteGame: vi.fn(),
  },
}));

vi.mock("../api/GenreGateway.js", () => ({
  genreGateway: { getGenres: vi.fn().mockResolvedValue([]) },
}));

const sampleGame: Game = {
  id: 1,
  name: "Gothic",
  genre: "RPG",
  price: 20,
  releaseDate: "2001-04-15",
};

describe("GamesTable", () => {
  beforeEach(() => {
    useToast().toasts.splice(0);
    vi.clearAllMocks();
  });

  it("shows an empty state spanning all 5 columns when there are no games", async () => {
    vi.mocked(gamesGateway.getGames).mockResolvedValue([]);

    const wrapper = mount(GamesTable, { attachTo: document.body });
    await flushPromises();

    const emptyCell = wrapper.find("td[colspan]");
    expect(emptyCell.exists()).toBe(true);
    expect(emptyCell.attributes("colspan")).toBe("5");
    expect(wrapper.text()).toContain("No games found.");

    wrapper.unmount();
  });

  it("deletes the game when the confirmation dialog is confirmed", async () => {
    vi.mocked(gamesGateway.getGames).mockResolvedValue([sampleGame]);
    vi.mocked(gamesGateway.deleteGame).mockResolvedValue(undefined);

    const wrapper = mount(GamesTable, { attachTo: document.body });
    await flushPromises();

    const buttons = wrapper.findAll("button");
    const deleteButton = buttons.find((b) => b.text().includes("Delete"))!;
    await deleteButton.trigger("click");

    const confirmButton = wrapper
      .findAll("button")
      .find((b) => b.text() === "Confirm")!;
    await confirmButton.trigger("click");
    await flushPromises();

    expect(gamesGateway.deleteGame).toHaveBeenCalledWith(sampleGame.id);

    wrapper.unmount();
  });

  it("does not delete the game when the confirmation dialog is cancelled", async () => {
    vi.mocked(gamesGateway.getGames).mockResolvedValue([sampleGame]);

    const wrapper = mount(GamesTable, { attachTo: document.body });
    await flushPromises();

    const deleteButton = wrapper
      .findAll("button")
      .find((b) => b.text().includes("Delete"))!;
    await deleteButton.trigger("click");

    const cancelButton = wrapper
      .findAll("button")
      .find((b) => b.text() === "Cancel")!;
    await cancelButton.trigger("click");
    await flushPromises();

    expect(gamesGateway.deleteGame).not.toHaveBeenCalled();

    wrapper.unmount();
  });

  it("shows an error toast when loading games fails", async () => {
    vi.mocked(gamesGateway.getGames).mockRejectedValue(new Error("boom"));

    const wrapper = mount(GamesTable, { attachTo: document.body });
    await flushPromises();

    const { toasts } = useToast();
    expect(toasts).toHaveLength(1);
    expect(toasts[0].variant).toBe("error");
    expect(toasts[0].message).toContain("boom");

    wrapper.unmount();
  });
});
