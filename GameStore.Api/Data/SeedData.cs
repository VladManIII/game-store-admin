using GameStore.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Api.Data;

public static class SeedData
{
    public static void Seed(DbContext context, bool _)
    {
        if (!context.Set<Genre>().Any())
        {
            context.Set<Genre>().AddRange(
                new Genre { Name = "RPG" },
                new Genre { Name = "Action RGP" },
                new Genre { Name = "Hack And Slash" }
            );

            context.SaveChanges();
        }

        if (!context.Set<Game>().Any())
        {
            context.Set<Game>().AddRange(
                new Game { Name = "Gothic 1", GenreId = 1, Price = 20.00M, ReleaseDate = new DateOnly(2001, 4, 15) },
                new Game { Name = "Gothic 2", GenreId = 1, Price = 25.50M, ReleaseDate = new DateOnly(2002, 11, 29) },
                new Game { Name = "Gothic 3", GenreId = 1, Price = 30.00M, ReleaseDate = new DateOnly(2006, 10, 13) },
                new Game { Name = "Gothic 1 Remake", GenreId = 1, Price = 49.99M, ReleaseDate = new DateOnly(2026, 6, 5) }
            );

            context.SaveChanges();
        }
    }
}
