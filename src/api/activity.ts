export type ActivityType = 'newFilm' | 'newRequest' | 'granted' | 'edited'

export interface ActivityItem {
  id: number
  filmId: number
  type: ActivityType
  at: string
}

const activity: ActivityItem[] = [
  { id: 1, filmId: 3, type: 'newRequest', at: '2026-10-22' },
  { id: 2, filmId: 2, type: 'granted', at: '2026-10-17' },
  { id: 3, filmId: 6, type: 'edited', at: '2026-10-12' },
  { id: 4, filmId: 7, type: 'newRequest', at: '2026-10-03' },
  { id: 5, filmId: 5, type: 'newFilm', at: '2026-09-30' },
  { id: 6, filmId: 1, type: 'edited', at: '2026-09-28' },
]

export function getRecentActivity(limit = 6): ActivityItem[] {
  return [...activity].sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit)
}
