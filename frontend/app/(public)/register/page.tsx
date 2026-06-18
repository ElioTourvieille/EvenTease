import Link from 'next/link'
import { CalendarDays, Building2, Users } from 'lucide-react'

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fcf9f8] p-6">

      {/* Logo */}
      <div className="mb-10 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: 'var(--brand-gradient)' }}
        >
          <CalendarDays className="h-6 w-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-[#005ab6]">EvenTease</span>
      </div>

      {/* Titre */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#1c1b1b]">Bienvenue&nbsp;!</h1>
        <p className="mt-2 text-[#717786]">
          Comment souhaitez-vous utiliser EvenTease&nbsp;?
        </p>
      </div>

      {/* Choix */}
      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 md:grid-cols-2">

        {/* Créer un espace */}
        <Link
          href="/register/create"
          className="group flex flex-col gap-4 rounded-2xl border-2 border-[#c1c6d7] bg-white p-8 transition-all hover:border-[#005ab6] hover:shadow-md"
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ background: 'var(--brand-gradient)' }}
          >
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#1c1b1b] group-hover:text-[#005ab6]">
              Créer mon espace entreprise
            </h2>
            <p className="mt-1 text-sm text-[#717786]">
              Créez votre organisation et invitez vos équipes. Vous serez administrateur principal.
            </p>
          </div>
          <span
            className="mt-auto inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--brand-gradient)' }}
          >
            Commencer →
          </span>
        </Link>

        {/* Rejoindre une entreprise */}
        <Link
          href="/register/join"
          className="group flex flex-col gap-4 rounded-2xl border-2 border-[#c1c6d7] bg-white p-8 transition-all hover:border-[#005ab6] hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#005ab6]/10">
            <Users className="h-6 w-6 text-[#005ab6]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#1c1b1b] group-hover:text-[#005ab6]">
              Rejoindre une entreprise
            </h2>
            <p className="mt-1 text-sm text-[#717786]">
              Vous avez reçu un code d&apos;invitation&nbsp;? Rejoignez l&apos;espace de votre organisation.
            </p>
          </div>
          <span className="mt-auto inline-flex items-center justify-center rounded-lg border-2 border-[#005ab6] px-4 py-2 text-sm font-semibold text-[#005ab6] transition-colors group-hover:bg-[#005ab6] group-hover:text-white">
            Rejoindre →
          </span>
        </Link>
      </div>

      <p className="mt-8 text-sm text-[#717786]">
        Déjà un compte&nbsp;?{' '}
        <Link href="/login" className="font-medium text-[#005ab6] hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  )
}
