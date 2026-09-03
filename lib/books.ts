export type Category =
  | 'Lycée / BAC'
  | 'Supérieur / CPGE'
  | 'Romans / Littérature'
  | 'Langues'

export interface Book {
  id: string
  title: string
  category: Category
  /** Price entered by the seller (the "actual price"). */
  price: number
  phone: string
  cover: string
  description: string
  /** True for used books sold by students — the sale price is auto-halved. */
  used?: boolean
  /** True once the book has been sold (editor-only tracking). */
  sold?: boolean
  /** The price the book was actually sold for, in DH. */
  soldPrice?: number
  /** ISO timestamp of when the book was marked sold. */
  soldAt?: string
}

/** Discount applied automatically to used (second-hand) books. */
export const USED_DISCOUNT = 0.5

/** The price a buyer actually pays: used books are auto-halved from the seller's price. */
export function getSalePrice(book: Book): number {
  return book.used ? Math.round(book.price * USED_DISCOUNT) : book.price
}

export const CATEGORIES: readonly (Category | 'Tous')[] = [
  'Tous',
  'Lycée / BAC',
  'Supérieur / CPGE',
  'Romans / Littérature',
  'Langues',
] as const

export const PUBLISH_CATEGORIES: readonly Category[] = [
  'Lycée / BAC',
  'Supérieur / CPGE',
  'Romans / Littérature',
  'Langues',
] as const

export const SEED_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Physique Chimie 2BAC SM / PC',
    category: 'Lycée / BAC',
    price: 45,
    phone: '0716326545',
    cover: '/books/physique-chimie-2bac.png',
    description:
      'Très bon état, tous les chapitres du programme national avec exercices corrigés.',
  },
  {
    id: '2',
    title: 'Les Misérables - Victor Hugo',
    category: 'Romans / Littérature',
    price: 30,
    phone: '0716326545',
    cover: '/books/les-miserables.png',
    description:
      'Texte intégral, propre sans annotations. Idéal pour étude de texte 1BAC.',
  },
  {
    id: '3',
    title: 'Mathématiques Tout-en-un CPGE MPSI',
    category: 'Supérieur / CPGE',
    price: 120,
    phone: '0716326545',
    cover: '/books/maths-cpge-mpsi.png',
    description:
      'Manuel complet Dunod. Légèrement corné sur la couverture, pages intérieures impeccables.',
  },
  {
    id: '4',
    title: 'Bescherelle Conjugaison & Grammaire',
    category: 'Langues',
    price: 35,
    phone: '0716326545',
    cover: '/books/bescherelle.png',
    description:
      'Guide pratique pour maîtriser la langue française. Indispensable pour le collège et lycée.',
  },
]

/** Normalize a Moroccan phone number into a wa.me-compatible international number. */
export function formatWhatsAppPhone(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '')
  if (cleaned.startsWith('0')) {
    cleaned = '212' + cleaned.substring(1)
  }
  return cleaned
}

export function buildWhatsAppUrl(book: Book, withPrice = true): string {
  const price = getSalePrice(book)
  const text = withPrice
    ? `Bonjour, je suis intéressé(e) par votre livre "${book.title}" proposé à ${price} DH sur EasyBook.`
    : `Bonjour, je suis intéressé(e) par votre livre "${book.title}" (${price} DH).`
  return `https://wa.me/${formatWhatsAppPhone(book.phone)}?text=${encodeURIComponent(text)}`
}
