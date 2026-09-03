'use client'

import { Bookmark, MessageCircle, Trash2, X } from 'lucide-react'
import { type Book, buildWhatsAppUrl } from '@/lib/books'

interface SavedDrawerProps {
  open: boolean
  onClose: () => void
  savedBooks: Book[]
  onRemove: (id: string) => void
}

export function SavedDrawer({
  open,
  onClose,
  savedBooks,
  onRemove,
}: SavedDrawerProps) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm transform flex-col bg-card-bg shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Livres enregistrés"
      >
        <div className="flex items-center justify-between border-b border-sand p-4">
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-terracotta" />
            <h2 className="text-lg font-bold text-ink">Livres Enregistrés</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-ink hover:bg-sand/60"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {savedBooks.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Bookmark className="mx-auto mb-2 h-8 w-8 opacity-50" />
              <p className="text-sm">Votre liste est vide pour le moment.</p>
            </div>
          ) : (
            savedBooks.map((book) => (
              <div
                key={book.id}
                className="flex items-center gap-3 rounded-xl border border-sand bg-paper p-2.5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={book.cover || '/placeholder.svg'}
                  alt={`Couverture du livre ${book.title}`}
                  className="h-16 w-12 flex-shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-xs font-bold text-ink">
                    {book.title}
                  </h3>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {book.category}
                  </p>
                  <span className="text-xs font-black text-terracotta">
                    {book.price} DH
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <a
                    href={buildWhatsAppUrl(book, false)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-whatsapp p-1.5 text-white hover:bg-whatsapp-hover"
                    aria-label="Contacter sur WhatsApp"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => onRemove(book.id)}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-destructive"
                    aria-label="Retirer des enregistrés"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  )
}
