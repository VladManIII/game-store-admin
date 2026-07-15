using Scalar.AspNetCore;
using GameStore.Api.Data;
using GameStore.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddValidation();
builder.Services.AddProblemDetails();
builder.Services.AddOpenApi();

// Allow the Vue dev server (Vite) to call this API during development.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.AddGameStoreDb();

var app = builder.Build();

app.UseExceptionHandler();

// Enable the CORS policy for development (Vite dev server)
app.UseCors("AllowLocalhost");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.MapGet("/health", () => "App Is Running");

app.MapGamesEndpoints();
app.MapGenresEndpoints();

app.MigrateDb();

app.Run();

public partial class Program { }
