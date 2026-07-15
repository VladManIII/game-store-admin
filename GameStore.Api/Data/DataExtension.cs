using Microsoft.EntityFrameworkCore;

namespace GameStore.Api.Data;

public static class DataExtension
{
    public static void MigrateDb(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<GameStoreContext>();

        dbContext.Database.Migrate();
    }

    public static void AddGameStoreDb(this WebApplicationBuilder builder)
    {
        var connectionString = builder.Configuration.GetConnectionString("GameStoreDb");

        builder.Services.AddSqlite<GameStoreContext>(
            connectionString,
            // Only auto-seed sample games/genres in Development — a real deployment still
            // gets its schema migrated on boot, just without fake data dropped into it.
            optionsAction: options =>
            {
                if (builder.Environment.IsDevelopment())
                {
                    options.UseSeeding(SeedData.Seed);
                }
            }
        );
    }
}
