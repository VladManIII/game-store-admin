using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace GameStore.Api.Tests;

public class GameStoreApiFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    // Genre CRUD isn't exposed via the API (it's read-only) — the app's own dev seed data
    // (see Data/DataExtension.cs) always creates "RPG" as the first genre, so tests can rely on this id.
    public const int SeededGenreId = 1;

    private readonly string _dbPath = Path.Combine(Path.GetTempPath(), $"gamestore-tests-{Guid.NewGuid():N}.db");

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Development");

        // Point at a fresh temp SQLite file instead of the real dev database. Reusing the
        // app's own connection-string configuration key (rather than replacing the
        // DbContextOptions registration in DI) keeps the existing migrate-and-seed
        // pipeline in Program.cs/DataExtension.cs intact, so tests get the same seeded
        // "RPG" genre (id 1) that a real dev run would produce, isolated to a disposable file.
        builder.ConfigureAppConfiguration((_, configBuilder) =>
        {
            configBuilder.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:GameStoreDb"] = $"Data Source={_dbPath}",
            });
        });
    }

    Task IAsyncLifetime.InitializeAsync()
    {
        // Accessing Services forces the host (and Program.cs's migrate/seed startup code) to run.
        using var scope = Services.CreateScope();
        return Task.CompletedTask;
    }

    async Task IAsyncLifetime.DisposeAsync()
    {
        await base.DisposeAsync();

        // Microsoft.Data.Sqlite pools connections per connection string, which keeps a
        // handle on the file open even after the DbContext/host are disposed. Clear the
        // pool first so the temp file can actually be deleted.
        SqliteConnection.ClearAllPools();
        if (File.Exists(_dbPath))
        {
            File.Delete(_dbPath);
        }
    }
}
