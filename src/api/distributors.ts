export interface DistributorNote {
  text: string
  validUntil?: string
}

export interface Distributor {
  id: number
  name: string
  note?: DistributorNote
}

const distributors: Distributor[] = [
  {
    id: 1,
    name: 'Beispiel-Verleih A',
    note: {
      text: 'Beispielhinweis: nimmt bis Mitte 2027 keine Anfragen an.',
      validUntil: '2027-06-30',
    },
  },
  { id: 2, name: 'Beispiel-Verleih B' },
  {
    id: 3,
    name: 'Beispiel-Verleih C',
    note: { text: 'Beispielhinweis: nimmt nur Anfragen für DCP an.' },
  },
  {
    id: 4,
    name: 'Beispiel-Verleih D',
    note: { text: 'Beispielhinweis: Katalog wird überarbeitet.', validUntil: '2025-12-31' },
  },
]

export function getDistributorById(id: number): Distributor | undefined {
  return distributors.find((distributor) => distributor.id === id)
}

export function getActiveNote(distributor: Distributor | undefined): DistributorNote | undefined {
  const note = distributor?.note
  if (!note) return undefined
  const today = new Date().toISOString().slice(0, 10)
  return note.validUntil === undefined || note.validUntil >= today ? note : undefined
}
