'use client'

import { Bookmark } from 'lucide-react'
import { type Book, buildWhatsAppUrl, getSalePrice } from '@/lib/books'
import { WhatsAppIcon } from './whatsapp-icon'

interface BookCardProps {
  book: Book
  isSaved: boolean
  onToggleSaved: (id: string) => void
}

export function BookCard({ book, isSaved, onToggleSaved }: BookCardProps) {
  return (
    <div className="group flex flex-col justify-between rounded-xl border border-sand bg-card-bg p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div>
        <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-lg bg-sand/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={book.cover || '/placeholder.svg'}
            alt={`Couverture du livre ${book.title}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span className="absolute left-2 top-2 rounded bg-card-bg/90 px-2 py-0.5 text-[10px] font-bold text-ink backdrop-blur-sm">
            {book.category}
          </span>
          {book.used && (
            <span className="absolute right-2 top-2 rounded bg-terracotta px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white shadow-sm">
              Occasion -50%
            </span>
          )}
        </div>

        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-bold leading-tight text-ink sm:text-base text-balance">
            {book.title}
          </h3>
          <span className="flex flex-col items-end whitespace-nowrap rounded-md bg-terracotta/10 px-2 py-0.5 text-right">
            {book.used && (
              <span className="text-[10px] font-semibold text-muted-foreground line-through">
                {book.price} DH
              </span>
            )}
            <span className="text-sm font-black text-terracotta">
              {getSalePrice(book)} DH
            </span>
          </span>
        </div>

        <p className="mb-3 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
          {book.description}
        </p>
      </div>

      <div className="space-y-2 border-t border-sand/60 pt-2">
        <a
          href={buildWhatsAppUrl(book)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-whatsapp py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-whatsapp-hover"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Contacter sur WhatsApp
        </a>

        <button
          type="button"
          onClick={() => onToggleSaved(book.id)}
          className={`flex w-full items-center justify-center gap-1.5 rounded-lg border py-1.5 text-xs font-semibold transition-colors ${
            isSaved
              ? 'border-terracotta bg-terracotta/10 text-terracotta'
              : 'border-sand text-ink hover:bg-sand/60'
          }`}
          aria-pressed={isSaved}
        >
          <Bookmark
            className="h-3.5 w-3.5"
            fill={isSaved ? 'currentColor' : 'none'}
          />
          {isSaved ? 'Enregistré' : 'Enregistrer'}
        </button>
      </div>
    </div>
  )
}
