'use client'

import { Camera, X } from 'lucide-react'
import { type FormEvent, useRef, useState } from 'react'
import { type Book, PUBLISH_CATEGORIES } from '@/lib/books'

interface PublishModalProps {
  open: boolean
  onClose: () => void
  onPublish: (book: Omit<Book, 'id'>) => void
}

const FALLBACK_COVER = '/books/generic-book-cover.png'

export function PublishModal({ open, onClose, onPublish }: PublishModalProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState('')

  if (!open) return null

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function reset() {
    setPreview('')
    if (fileRef.current) fileRef.current.value = ''
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    onPublish({
      title: String(data.get('title')),
      category: data.get('category') as Book['category'],
      price: Number.parseInt(String(data.get('price')), 10) || 0,
      phone: String(data.get('phone')),
      description: String(data.get('description')),
      cover: preview || FALLBACK_COVER,
      used: true,
    })
    form.reset()
    reset()
    onClose()
  }

  const labelClass =
    'mb-1 block text-xs font-bold uppercase tracking-wider text-ink/70'
  const fieldClass =
    'w-full rounded-lg border border-sand bg-sand/30 px-3 py-2 text-sm text-ink focus:border-terracotta focus:bg-card-bg focus:outline-none'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Mettre en vente un livre"
    >
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-sand bg-card-bg p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-ink hover:bg-sand/60"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-1 text-xl font-extrabold text-ink">
          Mettre en vente un livre
        </h2>
        <p className="mb-6 text-xs text-muted-foreground">
          Prends une photo, ajoute les détails et publie directement pour les
          étudiants.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                  <span className="text-[10px] text-muted-foreground">
                    PNG, JPG jusqu&apos;à 5MB
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
              placeholder="ex: Physique Chimie 2BAC, Mathématiques CPGE..."
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
                Prix d&apos;origine (DH) *
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min={0}
                required
                placeholder="ex: 40"
                className={fieldClass}
              />
            </div>
          </div>

          <p className="rounded-lg border border-terracotta/30 bg-terracotta/5 px-3 py-2 text-[11px] leading-relaxed text-ink/80">
            <span className="font-bold text-terracotta">Occasion :</span>{' '}
            comme il s&apos;agit d&apos;un livre d&apos;occasion, le prix de
            vente affiché sera automatiquement réduit de{' '}
            <span className="font-bold">50%</span> par rapport au prix
            d&apos;origine.
          </p>

          <div>
            <label htmlFor="phone" className={labelClass}>
              Numéro WhatsApp *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              defaultValue="0716326545"
              placeholder="ex: 0716326545"
              className={fieldClass}
            />
            <span className="text-[10px] text-muted-foreground">
              Les acheteurs vous contacteront directement via ce numéro.
            </span>
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>
              Petite description / État *
            </label>
            <textarea
              id="description"
              name="description"
              rows={2}
              required
              placeholder="ex: Bon état, quelques soulignements au crayon, disponible à Casablanca..."
              className={fieldClass}
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-terracotta py-2.5 text-sm font-bold text-white transition-all hover:bg-terracotta/90"
          >
            Publier l&apos;annonce
          </button>
        </form>
      </div>
    </div>
  )
}
