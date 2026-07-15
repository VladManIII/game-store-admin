import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import GenresView from "./GenresView.vue";
import { genreGateway } from "../api/GenreGateway.js";
import { useToast } from "../composables/useToast.js";

vi.mock("../api/GenreGateway.js", () => ({
  genreGateway: { getGenres: vi.fn() },
}));

describe("GenresView", () => {
  beforeEach(() => {
    useToast().toasts.splice(0);
    vi.clearAllMocks();
  });

  it("renders the loaded genres", async () => {
    vi.mocked(genreGateway.getGenres).mockResolvedValue([
      { id: 1, name: "RPG" },
      { id: 2, name: "Action RPG" },
    ]);

    const wrapper = mount(GenresView);
    await flushPromises();

    expect(wrapper.text()).toContain("RPG");
    expect(wrapper.text()).toContain("Action RPG");
  });

  it("shows an empty state when there are no genres", async () => {
    vi.mocked(genreGateway.getGenres).mockResolvedValue([]);

    const wrapper = mount(GenresView);
    await flushPromises();

    expect(wrapper.text()).toContain("No genres found.");
  });

  it("shows an error toast when loading genres fails", async () => {
    vi.mocked(genreGateway.getGenres).mockRejectedValue(new Error("boom"));

    mount(GenresView);
    await flushPromises();

    const { toasts } = useToast();

    expect(toasts).toHaveLength(1);
    expect(toasts[0].variant).toBe("error");
    expect(toasts[0].message).toContain("boom");
  });
});
