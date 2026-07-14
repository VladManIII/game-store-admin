using GameStore.Api.Data;
using GameStore.Api.Dtos;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Api.Endpoints;

public static class GenreSEndpoints
{
    public static void MapGenresEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/genres");

        group.MapGet("/", async (GameStoreContext dbContext) =>
        {
            return await dbContext.Genres.Select(genre => new GenreDto(genre.Id, genre.Name))
            // Read-only query: avoid tracking entities when we only need to return data.
            .AsNoTracking().
            ToListAsync();
        });
    }

}
