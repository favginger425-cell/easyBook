'use client'

import { BookOpen, Bookmark, PlusCircle, Search, Settings } from 'lucide-react'
import Link from 'next/link'

interface HeaderProps {
  search: string
  onSearch: (value: string) => void
  savedCount: number
  onOpenPublish: () => void
  onOpenSaved: () => void
  onResetCategory: () => void
}

export function Header({
  search,
  onSearch,
  savedCount,
  onOpenPublish,
  onOpenSaved,
  onResetCategory,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-sand bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onResetCategory}
          className="flex items-center gap-2"
          aria-label="EasyBook - accueil"
        >
          <BookOpen className="h-7 w-7 text-terracotta" />
          <span className="text-2xl font-bold tracking-tight text-ink">
            EasyBook
          </span>
        </button>

        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Rechercher un livre, une matière..."
            className="w-full rounded-full border border-transparent bg-sand/60 py-1.5 pl-9 pr-4 text-sm text-ink transition-all focus:border-terracotta focus:bg-card-bg focus:outline-none"
            aria-label="Rechercher"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenPublish}
            className="flex items-center gap-1.5 rounded-full bg-terracotta px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-terracotta/90 sm:px-4 sm:text-sm"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Vendre un livre</span>
          </button>

          <Link
            href="/gerer"
            className="rounded-full p-2 transition-colors hover:bg-sand/70"
            aria-label="Gérer les livres"
            title="Gérer les livres"
          >
            <Settings className="h-5 w-5 text-ink" />
          </Link>

          <button
            type="button"
            onClick={onOpenSaved}
            className="relative rounded-full p-2 transition-colors hover:bg-sand/70"
            aria-label="Livres enregistrés"
          >
            <Bookmark className="h-5 w-5 text-ink" />
            {savedCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-[10px] font-bold text-white">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
