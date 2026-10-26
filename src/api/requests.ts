import type { FilmFormat } from '../constants/requestOptions'

export type RequestStatus = 'open' | 'granted' | 'declined'

export interface Contact {
  name: string
  email?: string
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
  {
    id: 7,
    filmId: 1,
    distributorId: 1,
    status: 'granted',
    requestedAt: '2024-03-05',
    answeredAt: '2024-03-10',
    format: 'dcp',
    language: 'OV',
    cinema: 'Beispiel-Kino Z',
  },
]

export function getRequestsForFilm(filmId: number): FilmRequest[] {
  return requests
    .filter((request) => request.filmId === filmId)
    .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt))
}

export function getGrantedFilmIds(distributorId: number): number[] {
  const ids = requests
    .filter((request) => request.distributorId === distributorId && request.status === 'granted')
    .map((request) => request.filmId)
  return [...new Set(ids)]
}

export function getRequestsForCinemas(cinemas: string[]): FilmRequest[] {
  return requests
    .filter((request) => cinemas.includes(request.cinema))
    .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt))
}

export type NewRequest = Omit<FilmRequest, 'id'>

export function getRequestById(id: number): FilmRequest | undefined {
  return requests.find((request) => request.id === id)
}

export function createRequest(data: NewRequest): Promise<FilmRequest> {
  const nextId = Math.max(0, ...requests.map((request) => request.id)) + 1
  const request: FilmRequest = { ...data, id: nextId }
  requests.push(request)
  return Promise.resolve(request)
}

export function updateRequest(id: number, data: NewRequest): Promise<FilmRequest | undefined> {
  const index = requests.findIndex((request) => request.id === id)
  if (index === -1) return Promise.resolve(undefined)
  const updated: FilmRequest = { ...data, id }
  requests[index] = updated
  return Promise.resolve(updated)
}
