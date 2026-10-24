export type RequestStatus = 'open' | 'granted' | 'declined'
export type FilmFormat = 'film' | 'bluray' | 'dcp'

export interface Contact {
  name: string
  email: string
}

export interface FilmRequest {
  id: number
  filmId: number
  distributorId: number
  status: RequestStatus
  requestedAt: string
  answeredAt?: string
  format: FilmFormat
  language: string
  cinema: string
  contact?: Contact
  adRights?: string
  comment?: string
  declineReason?: string
  referredToDistributorId?: number
}

const requests: FilmRequest[] = [
  {
    id: 1,
    filmId: 3,
    distributorId: 2,
    status: 'open',
    requestedAt: '2026-10-02',
    format: 'dcp',
    language: 'OmU',
    cinema: 'Beispiel-Kino X',
  },
  {
    id: 2,
    filmId: 3,
    distributorId: 2,
    status: 'granted',
    requestedAt: '2026-03-02',
    answeredAt: '2026-03-14',
    format: 'dcp',
    language: 'OmU',
    cinema: 'Beispiel-Kino Y',
    contact: { name: 'Erika Beispiel', email: 'erika@example.org' },
    adRights: 'Plakat und Trailer erlaubt',
    comment: 'Die Kopie kam zwei Wochen vor dem Termin an.',
  },
  {
    id: 3,
    filmId: 3,
    distributorId: 1,
    status: 'declined',
    requestedAt: '2024-11-11',
    answeredAt: '2024-11-20',
    format: 'bluray',
    language: 'OV',
    cinema: 'Beispiel-Kino Z',
    declineReason: 'Hat die Rechte nicht mehr',
    referredToDistributorId: 2,
  },
  {
    id: 4,
    filmId: 2,
    distributorId: 1,
    status: 'granted',
    requestedAt: '2025-05-06',
    answeredAt: '2025-05-09',
    format: 'dcp',
    language: 'OV',
    cinema: 'Beispiel-Kino Y',
    contact: { name: 'Max Beispiel', email: 'max@example.org' },
  },
  {
    id: 5,
    filmId: 6,
    distributorId: 4,
    status: 'granted',
    requestedAt: '2025-01-15',
    answeredAt: '2025-01-20',
    format: 'dcp',
    language: 'OV',
    cinema: 'Beispiel-Kino Y',
  },
  {
    id: 6,
    filmId: 7,
    distributorId: 3,
    status: 'granted',
    requestedAt: '2025-09-01',
    answeredAt: '2025-09-04',
    format: 'bluray',
    language: 'OV',
    cinema: 'Beispiel-Kino X',
  },
]

export function getRequestsForFilm(filmId: number): FilmRequest[] {
  return requests
    .filter((request) => request.filmId === filmId)
    .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt))
}
