using System.Net;
using System.Net.Http.Json;
using GameStore.Api.Dtos;

namespace GameStore.Api.Tests;

public class GenreEndpointsTests : IClassFixture<GameStoreApiFactory>
{
    private readonly HttpClient _client;

    public GenreEndpointsTests(GameStoreApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetGenres_ReturnsOkWithSeededGenre()
    {
        var response = await _client.GetAsync("/genres");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var genres = await response.Content.ReadFromJsonAsync<List<GenreDto>>();

        Assert.Contains(genres!, g => g.Id == GameStoreApiFactory.SeededGenreId);
    }
}
