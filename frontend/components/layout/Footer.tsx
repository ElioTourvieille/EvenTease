import Link from 'next/link'
import { Mail, MapPin, ArrowRight } from 'lucide-react'

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7H10V9h4v1.765A4.962 4.962 0 0 1 16 8zM2 9h4v12H2zm2-7a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
  </svg>
)

const QUICK_LINKS = ['Accueil', 'Nos Solutions', 'Témoignages', 'Blog']
const SUPPORT_LINKS = ["Centre d'aide", 'Sécurité', 'API', 'Statut']
const LEGAL_LINKS = ['Confidentialité', 'CGU', 'Mentions Légales']

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#1c1b1b] text-white">
      <div className="mx-auto max-w-[1440px] px-10 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">

          {/* Colonne 1 — Marque */}
          <div className="space-y-4">
            <div>
              <p className="text-lg font-bold">EvenTease</p>
              <p className="mt-2 text-sm leading-relaxed text-[#c1c6d7]">
                Simplifier la complexité événementielle grâce à l&apos;innovation technologique.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com/originstudioch"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-[#717786] transition-colors hover:text-white"
              >
                <XIcon />
              </a>
              <a
                href="https://www.linkedin.com/company/origin-studio"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-[#717786] transition-colors hover:text-white"
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>

          {/* Colonne 2 — Liens rapides */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#c1c6d7]">
              Liens Rapides
            </p>
            <ul className="space-y-2">
              {QUICK_LINKS.map((label) => (
                <li key={label}>
                  <Link href="/" className="text-sm text-[#717786] transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 — Support */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#c1c6d7]">
              Support
            </p>
            <ul className="space-y-2">
              {SUPPORT_LINKS.map((label) => (
                <li key={label}>
                  <Link href="/" className="text-sm text-[#717786] transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4 — Contact + Newsletter */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#c1c6d7]">
              Contact
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#717786]">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="text-sm">hello@eventease.com</span>
              </div>
              <div className="flex items-center gap-2 text-[#717786]">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="text-sm">Genève, Suisse</span>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-[#c1c6d7]">Newsletter</p>
              <div className="flex overflow-hidden rounded-lg border border-[#414754]">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder:text-[#717786] outline-none"
                />
                <button
                  type="button"
                  aria-label="S'abonner"
                  className="px-3 py-2 transition-opacity hover:opacity-80"
                  style={{ background: 'var(--brand-gradient)' }}
                >
                  <ArrowRight className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barre inférieure */}
      <div className="border-t border-[#414754]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 px-10 py-4 md:flex-row">
          <p className="text-xs text-[#717786]">© {year} EvenTease. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            {LEGAL_LINKS.map((label) => (
              <Link key={label} href="/" className="text-xs text-[#717786] transition-colors hover:text-white">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
