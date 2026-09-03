'use client'

import { CATEGORIES } from '@/lib/books'

interface CategoryPillsProps {
  selected: string
  onSelect: (category: string) => void
}

export function CategoryPills({ selected, onSelect }: CategoryPillsProps) {
  return (
    <div className="scrollbar-none mb-6 flex items-center gap-2 overflow-x-auto pb-4">
      {CATEGORIES.map((cat) => {
        const isActive = cat === selected
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelect(cat)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-all sm:text-sm ${
              isActive
                ? 'bg-terracotta text-white'
                : 'bg-sand/60 text-ink hover:bg-sand'
            }`}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}
