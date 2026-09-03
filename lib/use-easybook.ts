'use client'

import { useCallback, useEffect, useState } from 'react'
import { type Book, SEED_BOOKS } from './books'

const BOOKS_KEY = 'easybook_books'
const SAVED_KEY = 'easybook_saved'

export function useEasyBook() {
  const [books, setBooks] = useState<Book[]>(SEED_BOOKS)
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Load persisted state once on mount.
  useEffect(() => {
    try {
      const storedBooks = localStorage.getItem(BOOKS_KEY)
      if (storedBooks) {
        const parsed = JSON.parse(storedBooks) as Book[]
        if (Array.isArray(parsed) && parsed.length > 0) setBooks(parsed)
      }
      const storedSaved = localStorage.getItem(SAVED_KEY)
      if (storedSaved) {
        const parsed = JSON.parse(storedSaved) as string[]
        if (Array.isArray(parsed)) setSavedIds(parsed)
      }
    } catch {
      // Ignore malformed storage and fall back to seed data.
    }
    setHydrated(true)
  }, [])

  // Persist books after hydration.
  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books))
  }, [books, hydrated])

  // Persist saved ids after hydration.
  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(SAVED_KEY, JSON.stringify(savedIds))
  }, [savedIds, hydrated])

  const addBook = useCallback((book: Omit<Book, 'id'>) => {
    setBooks((prev) => [{ ...book, id: Date.now().toString() }, ...prev])
  }, [])

  const updateBook = useCallback((id: string, updates: Omit<Book, 'id'>) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...updates, id } : b)),
    )
  }, [])

  const deleteBook = useCallback((id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id))
    setSavedIds((prev) => prev.filter((x) => x !== id))
  }, [])

  const markSold = useCallback((id: string, soldPrice: number) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, sold: true, soldPrice, soldAt: new Date().toISOString() }
          : b,
      ),
    )
  }, [])

  const markAvailable = useCallback((id: string) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, sold: false, soldPrice: undefined, soldAt: undefined }
          : b,
      ),
    )
  }, [])

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }, [])

  return {
    books,
    savedIds,
    hydrated,
    addBook,
    updateBook,
    deleteBook,
    markSold,
    markAvailable,
    toggleSaved,
  }
}
