export interface Film {
  id: number
  originalTitle: string
  germanTitle: string
  year: number
  distributor: string
}

const films: Film[] = [
  {
    id: 1,
    originalTitle: 'Das Cabinet des Dr. Caligari',
    germanTitle: 'Das Cabinet des Dr. Caligari',
    year: 1920,
    distributor: 'Beispiel-Verleih A',
  },
  {
    id: 2,
    originalTitle: 'Metropolis',
    germanTitle: 'Metropolis',
    year: 1927,
    distributor: 'Beispiel-Verleih A',
  },
  {
    id: 3,
    originalTitle: 'Tokyo monogatari',
    germanTitle: 'Reise nach Tokio',
    year: 1953,
    distributor: 'Beispiel-Verleih B',
  },
  {
    id: 4,
    originalTitle: 'Les quatre cents coups',
    germanTitle: 'Sie küssten und sie schlugen ihn',
    year: 1959,
    distributor: 'Beispiel-Verleih B',
  },
  {
    id: 5,
    originalTitle: 'Persona',
    germanTitle: 'Persona',
    year: 1966,
    distributor: 'Beispiel-Verleih C',
  },
  {
    id: 6,
    originalTitle: 'Das Boot',
    germanTitle: 'Das Boot',
    year: 1981,
    distributor: 'Beispiel-Verleih C',
  },
  {
    id: 7,
    originalTitle: 'Lola rennt',
    germanTitle: 'Lola rennt',
    year: 1998,
    distributor: 'Beispiel-Verleih D',
  },
]

export function searchFilms(query: string): Film[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return films.filter((film) =>
    [film.originalTitle, film.germanTitle].some((title) => title.toLowerCase().includes(q)),
  )
}
