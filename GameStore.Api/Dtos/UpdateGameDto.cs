using System.ComponentModel.DataAnnotations;

namespace GameStore.Api.Dtos;

public record UpdateGameDto(
    [Required][StringLength(70)]
    string Name,
    [Required][Range(1, 100)]
    int GenreId,
    [Required][Range(0, 250)]
    decimal Price,
    DateOnly ReleaseDate
);