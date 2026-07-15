using System.Net;
using System.Net.Http.Json;
using GameStore.Api.Data;
using GameStore.Api.Dtos;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace GameStore.Api.Tests;

public class GamesEndpointsTests : IClassFixture<GameStoreApiFactory>, IAsyncLifetime
{
    private readonly GameStoreApiFactory _factory;
    private readonly HttpClient _client;

    public GamesEndpointsTests(GameStoreApiFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    // The class fixture shares one SQLite file across every test for speed, so wipe out
    // whatever games a previous test left behind before each one runs. Genres stay seeded.
    public async Task InitializeAsync()
    {
        using var scope = _factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<GameStoreContext>();

        await dbContext.Games.ExecuteDeleteAsync();
    }

    public Task DisposeAsync() => Task.CompletedTask;

    private static NewGameDto ValidGame(string name = "Test Game") =>
        new(name, GameStoreApiFactory.SeededGenreId, 19.99M, new DateOnly(2024, 1, 1));

    private async Task<GameDetailsDto> CreateGame(string name = "Test Game")
    {
        var response = await _client.PostAsJsonAsync("/games", ValidGame(name));
        response.EnsureSuccessStatusCode();

        return (await response.Content.ReadFromJsonAsync<GameDetailsDto>())!;
    }

    [Fact]
    public async Task GetGames_ReturnsOkWithCreatedGame()
    {
        var created = await CreateGame("List Game");
        var response = await _client.GetAsync("/games");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var games = await response.Content.ReadFromJsonAsync<List<GameSummaryDto>>();

        Assert.Contains(games!, g => g.Id == created.Id && g.Name == "List Game");
    }

    [Fact]
    public async Task GetGame_ExistingId_ReturnsOkWithGame()
    {
        var created = await CreateGame("Details Game");
        var response = await _client.GetAsync($"/games/{created.Id}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var game = await response.Content.ReadFromJsonAsync<GameDetailsDto>();

        Assert.Equal("Details Game", game!.Name);
    }

    [Fact]
    public async Task GetGame_MissingId_ReturnsNotFound()
    {
        var response = await _client.GetAsync("/games/999999");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task PostGame_Valid_ReturnsCreatedWithLocation()
    {
        var response = await _client.PostAsJsonAsync("/games", ValidGame("Created Game"));

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.NotNull(response.Headers.Location);

        var game = await response.Content.ReadFromJsonAsync<GameDetailsDto>();

        Assert.Equal("Created Game", game!.Name);
    }

    [Fact]
    public async Task PostGame_InvalidPrice_ReturnsBadRequest()
    {
        var invalidGame = new NewGameDto("Bad Game", GameStoreApiFactory.SeededGenreId, -5M, new DateOnly(2024, 1, 1));
        var response = await _client.PostAsJsonAsync("/games", invalidGame);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task PutGame_ExistingId_ReturnsNoContentAndUpdates()
    {
        var created = await CreateGame("Original Name");
        var update = new UpdateGameDto("Updated Name", GameStoreApiFactory.SeededGenreId, 29.99M, new DateOnly(2025, 1, 1));
        var putResponse = await _client.PutAsJsonAsync($"/games/{created.Id}", update);

        Assert.Equal(HttpStatusCode.NoContent, putResponse.StatusCode);

        var getResponse = await _client.GetFromJsonAsync<GameDetailsDto>($"/games/{created.Id}");

        Assert.Equal("Updated Name", getResponse!.Name);
    }

    [Fact]
    public async Task PutGame_MissingId_ReturnsNotFound()
    {
        var update = new UpdateGameDto("Doesn't Matter", GameStoreApiFactory.SeededGenreId, 10M, new DateOnly(2024, 1, 1));
        var response = await _client.PutAsJsonAsync("/games/999999", update);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task DeleteGame_ExistingId_ReturnsNoContent()
    {
        var created = await CreateGame("To Delete");
        var response = await _client.DeleteAsync($"/games/{created.Id}");

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }

    [Fact]
    public async Task DeleteGame_MissingId_IsIdempotentAndReturnsNoContent()
    {
        // The endpoint uses ExecuteDeleteAsync, which reports success even when
        // nothing matched — this asserts that real (idempotent) behavior.
        var response = await _client.DeleteAsync("/games/999999");

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }
}
