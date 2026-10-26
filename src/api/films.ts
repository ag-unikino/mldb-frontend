export type FilmLinkSource = 'imdb' | 'tmdb' | 'wikidata' | 'allscreens' | 'filmportal'

export interface FilmLink {
  source: FilmLinkSource
  url: string
}

export interface FilmVersion {
  name: string
  runtimeMinutes?: number
  note?: string
}

export interface Film {
  id: number
  originalTitle: string
  englishTitle?: string
  germanTitle: string
  year: number
  fsk?: number
  runtimeMinutes?: number
  germanRelease?: string
  worldPremiere?: string
  versions?: FilmVersion[]
  comment?: string
  links?: FilmLink[]
  posterPath?: string
}

const films: Film[] = [
  {
    id: 1,
    originalTitle: 'Das Cabinet des Dr. Caligari',
    germanTitle: 'Das Cabinet des Dr. Caligari',
    year: 1920,
  },
  {
    id: 2,
    originalTitle: 'Metropolis',
    germanTitle: 'Metropolis',
    year: 1927,
    fsk: 12,
    runtimeMinutes: 150,
    versions: [{ name: 'Restaurierte Fassung (2010)', runtimeMinutes: 150 }],
    posterPath: '/vODOVn29fr0nLF9MVfpfKDcxuXF.jpg',
  },
  {
    id: 3,
    originalTitle: 'Tokyo monogatari',
    englishTitle: 'Tokyo Story',
    germanTitle: 'Reise nach Tokio',
    year: 1953,
    fsk: 6,
    runtimeMinutes: 136,
    worldPremiere: '1953-11-03',
    germanRelease: '1965-06-01',
    versions: [
      { name: 'Originalfassung (OmU)', runtimeMinutes: 136, note: 'Restaurierte Fassung.' },
      {
        name: 'Gekürzte Kinofassung',
        runtimeMinutes: 128,
        note: 'Beispielnotiz: Verleihstatus unklar.',
      },
    ],
    comment: 'Beispielkommentar: Bei Anfragen immer die restaurierte Fassung erwähnen.',
    links: [
      { source: 'imdb', url: 'https://www.imdb.com/' },
      { source: 'tmdb', url: 'https://www.themoviedb.org/' },
      { source: 'wikidata', url: 'https://www.wikidata.org/' },
      { source: 'filmportal', url: 'https://www.filmportal.de/' },
    ],
  },
  {
    id: 4,
    originalTitle: 'Les quatre cents coups',
    germanTitle: 'Sie küssten und sie schlugen ihn',
    year: 1959,
  },
  {
    id: 5,
    originalTitle: 'Persona',
    germanTitle: 'Persona',
    year: 1966,
  },
  {
    id: 6,
    originalTitle: 'Das Boot',
    germanTitle: 'Das Boot',
    year: 1981,
  },
  {
    id: 7,
    originalTitle: 'Lola rennt',
    germanTitle: 'Lola rennt',
    year: 1998,
  },
]

export function searchFilms(query: string): Film[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return films.filter((film) =>
    [film.originalTitle, film.germanTitle].some((title) => title.toLowerCase().includes(q)),
  )
}

export function getFilmById(id: number): Film | undefined {
  return films.find((film) => film.id === id)
}

export function getAllFilms(): Film[] {
  return [...films]
}
