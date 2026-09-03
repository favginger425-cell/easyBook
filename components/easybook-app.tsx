'use client'

import { BookOpenCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useEasyBook } from '@/lib/use-easybook'
import { BookCard } from './book-card'
import { CategoryPills } from './category-pills'
import { Header } from './header'
import { PublishModal } from './publish-modal'
import { SavedDrawer } from './saved-drawer'

export function EasyBookApp() {
  const { books, savedIds, addBook, toggleSaved } = useEasyBook()
  const [category, setCategory] = useState('Tous')
  const [search, setSearch] = useState('')
  const [publishOpen, setPublishOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return books.filter((book) => {
      const matchesCategory = category === 'Tous' || book.category === category
      const matchesSearch =
        q === '' ||
        book.title.toLowerCase().includes(q) ||
        book.description.toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
  }, [books, category, search])

  const savedBooks = useMemo(
    () => books.filter((b) => savedIds.includes(b.id)),
    [books, savedIds],
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        search={search}
        onSearch={setSearch}
        savedCount={savedIds.length}
        onOpenPublish={() => setPublishOpen(true)}
        onOpenSaved={() => setDrawerOpen(true)}
        onResetCategory={() => setCategory('Tous')}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-ink text-balance sm:text-4xl">
            Ktabak hna, b&apos;prix étudiant{' '}
            <span className="block text-lg font-semibold text-terracotta sm:inline sm:text-2xl">
              (Ton livre à prix d&apos;étudiant)
            </span>
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base text-pretty">
            Économise sur tes livres. La solution simple pour acheter et
            revendre tes affaires scolaires au Maroc.
          </p>
        </div>

        <CategoryPills selected={category} onSelect={setCategory} />

        {filtered.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <BookOpenCheck className="mx-auto mb-2 h-10 w-10 opacity-40" />
            <p className="text-sm">
              Aucun livre trouvé. Soyez le premier à en publier un !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                isSaved={savedIds.includes(book.id)}
                onToggleSaved={toggleSaved}
              />
            ))}
          </div>
        )}
      </main>

      <PublishModal
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        onPublish={addBook}
      />

      <SavedDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        savedBooks={savedBooks}
        onRemove={toggleSaved}
      />
    </div>
  )
}
