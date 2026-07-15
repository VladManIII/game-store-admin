using Microsoft.EntityFrameworkCore;

namespace GameStore.Api.Data;

public static class DataExtension
{
    // Auto-migrating on startup is convenient for local development, but a real deployment
    // should apply migrations as an explicit, separate step rather than on every app boot.
    public static void MigrateDb(this WebApplication app)
    {
        if (!app.Environment.IsDevelopment())
        {
            return;
        }

        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<GameStoreContext>();

        dbContext.Database.Migrate();
    }

    public static void AddGameStoreDb(this WebApplicationBuilder builder)
    {
        var connectionString = builder.Configuration.GetConnectionString("GameStoreDb");

        builder.Services.AddSqlite<GameStoreContext>(
            connectionString,
            optionsAction: options => options.UseSeeding(SeedData.Seed)
        );
    }
}
