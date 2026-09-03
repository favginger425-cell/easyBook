'use client'

import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Pencil,
  Plus,
  RotateCcw,
  Tag,
  Trash2,
  TrendingUp,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { type FormEvent, useRef, useState } from 'react'
import { type Book, getSalePrice, PUBLISH_CATEGORIES } from '@/lib/books'
import { useEasyBook } from '@/lib/use-easybook'

const FALLBACK_COVER = '/books/generic-book-cover.png'

const labelClass =
  'mb-1 block text-xs font-bold uppercase tracking-wider text-ink/70'
const fieldClass =
  'w-full rounded-lg border border-sand bg-sand/30 px-3 py-2 text-sm text-ink focus:border-terracotta focus:bg-card-bg focus:outline-none'

export function BookEditor() {
  const {
    books,
    hydrated,
    addBook,
    updateBook,
    deleteBook,
    markSold,
    markAvailable,
  } = useEasyBook()
  const fileRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [preview, setPreview] = useState('')
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [sellingId, setSellingId] = useState<string | null>(null)
  const [sellPrice, setSellPrice] = useState('')

  const editing = editingId
    ? books.find((b) => b.id === editingId) ?? null
    : null

  const soldBooks = books.filter((b) => b.sold)
  const availableCount = books.length - soldBooks.length
  const totalRevenue = soldBooks.reduce((sum, b) => sum + (b.soldPrice ?? 0), 0)

  function startSell(book: Book) {
    setSellingId(book.id)
    setSellPrice(String(getSalePrice(book)))
  }

  function confirmSell() {
    if (!sellingId) return
    markSold(sellingId, Number.parseInt(sellPrice, 10) || 0)
    setSellingId(null)
    setSellPrice('')
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function startEdit(book: Book) {
    setEditingId(book.id)
    setPreview(book.cover)
    if (fileRef.current) fileRef.current.value = ''
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function resetForm() {
    setEditingId(null)
    setPreview('')
    formRef.current?.reset()
    if (fileRef.current) fileRef.current.value = ''
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const payload: Omit<Book, 'id'> = {
      title: String(data.get('title')),
      category: data.get('category') as Book['category'],
      price: Number.parseInt(String(data.get('price')), 10) || 0,
      phone: String(data.get('phone')),
      description: String(data.get('description')),
      cover: preview || editing?.cover || FALLBACK_COVER,
      used: data.get('used') === 'on',
    }
    if (editingId) {
      updateBook(editingId, payload)
    } else {
      addBook(payload)
    }
    resetForm()
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Gérer les livres
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ajoute, modifie ou supprime les annonces de ton catalogue.
          </p>
        </div>
        <Link
          href="/"
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-sand bg-card-bg px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-sand/60 sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour</span>
        </Link>
      </div>

      {/* Sales tracker — editor only */}
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-sand bg-card-bg p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-ink/60">
            En vente
          </p>
          <p className="mt-1 text-2xl font-black text-ink">
            {hydrated ? availableCount : '...'}
          </p>
        </div>
        <div className="rounded-2xl border border-sand bg-card-bg p-4 shadow-sm">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink/60">
            <CheckCircle2 className="h-3.5 w-3.5 text-terracotta" />
            Vendus
          </p>
          <p className="mt-1 text-2xl font-black text-ink">
            {hydrated ? soldBooks.length : '...'}
          </p>
        </div>
        <div className="rounded-2xl border border-terracotta/30 bg-terracotta/10 p-4 shadow-sm">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-terracotta">
            <TrendingUp className="h-3.5 w-3.5" />
            Total encaissé
          </p>
          <p className="mt-1 text-2xl font-black text-terracotta">
            {hydrated ? totalRevenue : '...'} <span className="text-sm">DH</span>
          </p>
        </div>
      </div>

      {/* Recently sold log */}
      {hydrated && soldBooks.length > 0 && (
        <div className="mb-8 rounded-2xl border border-sand bg-card-bg p-5 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
            <Tag className="h-4 w-4 text-terracotta" />
            Historique des ventes
          </h2>
          <ul className="divide-y divide-sand/70">
            {soldBooks
              .slice()
              .sort((a, b) => (b.soldAt ?? '').localeCompare(a.soldAt ?? ''))
              .map((book) => (
                <li
                  key={book.id}
                  className="flex items-center justify-between gap-3 py-2 text-sm"
                >
                  <span className="min-w-0 flex-1 truncate font-semibold text-ink">
                    {book.title}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {book.soldAt
                      ? new Date(book.soldAt).toLocaleDateString('fr-FR')
                      : ''}
                  </span>
                  <span className="shrink-0 font-black text-terracotta">
                    {book.soldPrice} DH
                  </span>
                </li>
              ))}
          </ul>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        {/* Form */}
        <section className="lg:sticky lg:top-24 lg:self-start">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-sand bg-card-bg p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                {editing ? (
                  <>
                    <Pencil className="h-5 w-5 text-terracotta" />
                    Modifier le livre
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 text-terracotta" />
                    Ajouter un livre
                  </>
                )}
              </h2>
              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-muted-foreground hover:bg-sand/60"
                >
                  <X className="h-3.5 w-3.5" />
                  Annuler
                </button>
              )}
            </div>

            <div>
              <span className={labelClass}>Photo du livre</span>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="relative w-full cursor-pointer rounded-xl border-2 border-dashed border-sand bg-sand/20 p-4 text-center transition-colors hover:border-terracotta"
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImage}
                />
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview || '/placeholder.svg'}
                    alt="Aperçu de la photo du livre"
                    className="h-48 w-full rounded-lg object-cover"
                  />
                ) : (
                  <span className="flex flex-col items-center py-2">
                    <Camera className="mb-1 h-8 w-8 text-muted-foreground" />
                    <span className="text-xs font-semibold text-ink/70">
                      Prendre ou choisir une photo
                    </span>
                  </span>
                )}
              </button>
            </div>

            <div>
              <label htmlFor="title" className={labelClass}>
                Titre / Matière *
              </label>
              <input
                id="title"
                name="title"
                required
                defaultValue={editing?.title ?? ''}
                key={`title-${editingId ?? 'new'}`}
                placeholder="ex: Physique Chimie 2BAC..."
                className={fieldClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="category" className={labelClass}>
                  Catégorie *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  defaultValue={editing?.category ?? PUBLISH_CATEGORIES[0]}
                  key={`cat-${editingId ?? 'new'}`}
                  className={fieldClass}
                >
                  {PUBLISH_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="price" className={labelClass}>
                  Prix (DH) *
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min={0}
                  required
                  defaultValue={editing?.price ?? ''}
                  key={`price-${editingId ?? 'new'}`}
                  placeholder="ex: 40"
                  className={fieldClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className={labelClass}>
                Numéro WhatsApp *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                defaultValue={editing?.phone ?? '0716326545'}
                key={`phone-${editingId ?? 'new'}`}
                placeholder="ex: 0716326545"
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>
                Description / État *
              </label>
              <textarea
                id="description"
                name="description"
                rows={2}
                required
                defaultValue={editing?.description ?? ''}
                key={`desc-${editingId ?? 'new'}`}
                placeholder="ex: Bon état, disponible à Casablanca..."
                className={fieldClass}
              />
            </div>

            <label
              htmlFor="used"
              className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-sand bg-sand/20 p-3"
            >
              <input
                id="used"
                name="used"
                type="checkbox"
                defaultChecked={editing?.used ?? false}
                key={`used-${editingId ?? 'new'}`}
                className="mt-0.5 h-4 w-4 shrink-0 accent-terracotta"
              />
              <span className="text-xs leading-relaxed text-ink/80">
                <span className="font-bold text-ink">Livre d&apos;occasion</span>{' '}
                — le prix de vente affiché sera automatiquement réduit de{' '}
                <span className="font-bold text-terracotta">50%</span> par
                rapport au prix d&apos;origine.
              </span>
            </label>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-terracotta py-2.5 text-sm font-bold text-white transition-all hover:bg-terracotta/90"
            >
              {editing ? 'Enregistrer les modifications' : 'Ajouter le livre'}
            </button>
          </form>
        </section>

        {/* List */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">
              Catalogue{' '}
              <span className="text-sm font-normal text-muted-foreground">
                ({hydrated ? books.length : '...'})
              </span>
            </h2>
          </div>

          {hydrated && books.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-sand bg-card-bg p-10 text-center text-sm text-muted-foreground">
              Aucun livre dans le catalogue. Ajoute ton premier livre.
            </div>
          ) : (
            <ul className="space-y-3">
              {books.map((book) => (
                <li
                  key={book.id}
                  className={`flex items-center gap-3 rounded-xl border p-3 shadow-sm ${
                    book.sold
                      ? 'border-sand/60 bg-sand/20'
                      : 'border-sand bg-card-bg'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={book.cover || '/placeholder.svg'}
                    alt={book.title}
                    className={`h-20 w-14 shrink-0 rounded-md object-cover ${
                      book.sold ? 'opacity-60 grayscale' : ''
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 truncate text-sm font-bold text-ink">
                      {book.title}
                      {book.sold && (
                        <span className="shrink-0 rounded bg-terracotta px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                          Vendu
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {book.category}
                    </p>
                    {book.sold ? (
                      <p className="mt-0.5 text-sm font-black text-terracotta">
                        Vendu à {book.soldPrice} DH
                        <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                          (annonce: {getSalePrice(book)} DH)
                        </span>
                      </p>
                    ) : (
                      <p className="mt-0.5 flex items-center gap-1.5 text-sm font-black text-terracotta">
                        {getSalePrice(book)} <span className="text-xs">DH</span>
                        {book.used && (
                          <>
                            <span className="text-xs font-semibold text-muted-foreground line-through">
                              {book.price} DH
                            </span>
                            <span className="rounded bg-terracotta/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-terracotta">
                              Occasion
                            </span>
                          </>
                        )}
                      </p>
                    )}
                  </div>

                  {sellingId === book.id ? (
                    <div className="flex shrink-0 items-center gap-1.5">
                      <input
                        type="number"
                        min={0}
                        value={sellPrice}
                        onChange={(e) => setSellPrice(e.target.value)}
                        aria-label="Prix de vente réel"
                        className="w-20 rounded-lg border border-sand bg-card-bg px-2 py-1.5 text-sm text-ink focus:border-terracotta focus:outline-none"
                      />
                      <span className="text-xs font-semibold text-muted-foreground">
                        DH
                      </span>
                      <button
                        type="button"
                        onClick={confirmSell}
                        className="rounded-lg bg-terracotta px-2.5 py-1.5 text-xs font-bold text-white hover:bg-terracotta/90"
                      >
                        OK
                      </button>
                      <button
                        type="button"
                        onClick={() => setSellingId(null)}
                        className="rounded-lg border border-sand px-2.5 py-1.5 text-xs font-semibold text-ink hover:bg-sand/60"
                      >
                        Non
                      </button>
                    </div>
                  ) : confirmId === book.id ? (
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          deleteBook(book.id)
                          setConfirmId(null)
                          if (editingId === book.id) resetForm()
                        }}
                        className="rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-red-700"
                      >
                        Supprimer
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmId(null)}
                        className="rounded-lg border border-sand px-2.5 py-1.5 text-xs font-semibold text-ink hover:bg-sand/60"
                      >
                        Non
                      </button>
                    </div>
                  ) : (
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => startEdit(book)}
                        aria-label={`Modifier ${book.title}`}
                        className="rounded-lg border border-sand p-2 text-ink transition-colors hover:bg-sand/60"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmId(book.id)}
                        aria-label={`Supprimer ${book.title}`}
                        className="rounded-lg border border-sand p-2 text-red-600 transition-colors hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
