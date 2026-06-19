'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useInView, type Transition } from 'framer-motion'
import {
  CalendarDays,
  Users,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  LayoutGrid,
  Menu,
  X,
  Sparkles,
  Bell,
  Plus,
  ChevronRight,
} from 'lucide-react'

/* ══════════════════════════════════════════════════════════════════════════
   AnimatedText — lettre par lettre
   ══════════════════════════════════════════════════════════════════════════ */
function AnimatedText({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ')
  return (
    <motion.span
      className={className}
      aria-label={text}
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.035, delayChildren: 0.1 } } }}
    >
      {words.map((word, wi) => (
        <span key={wi} className="inline-block">
          <span className="inline-block overflow-hidden">
            {word.split('').map((char, ci) => (
              <motion.span
                key={ci}
                className="inline-block"
                variants={{
                  hidden:  { y: '110%', opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                {char}
              </motion.span>
            ))}
          </span>
          {wi < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   Header sticky — fond clair
   ══════════════════════════════════════════════════════════════════════════ */
function LandingHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-[#c1c6d7] bg-white/90 backdrop-blur-md shadow-sm'
          : 'bg-white',
      ].join(' ')}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: 'var(--brand-gradient)' }}
          >
            <LayoutGrid className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold text-[#1c1b1b]">EvenTease</span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-7 md:flex">
          {[
            { label: 'Accueil',         href: '#hero' },
            { label: 'Fonctionnalités', href: '#features' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm font-medium text-[#414754] transition-colors hover:text-[#1c1b1b]"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-[#414754] transition-colors hover:text-[#1c1b1b]"
          >
            Connexion
          </Link>
          <Link
            href="/register"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--brand-gradient)' }}
          >
            Inscription
          </Link>
        </div>

        <button className="md:hidden text-[#414754]" onClick={() => setOpen(v => !v)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-[#c1c6d7] bg-white px-6 py-4 md:hidden"
        >
          <div className="flex flex-col gap-3">
            <Link href="/login"    className="text-sm text-[#414754]" onClick={() => setOpen(false)}>Connexion</Link>
            <Link href="/register" className="text-sm font-semibold text-[#005ab6]" onClick={() => setOpen(false)}>Inscription →</Link>
          </div>
        </motion.div>
      )}
    </header>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   Mock Dashboard — version claire
   ══════════════════════════════════════════════════════════════════════════ */
function MockDashboardLight() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Glow */}
      <div
        className="absolute -inset-6 rounded-3xl opacity-10 blur-3xl"
        style={{ background: 'var(--brand-gradient)' }}
      />

      <div className="relative overflow-hidden rounded-2xl border border-[#c1c6d7] bg-white shadow-xl">
        {/* Barre titre */}
        <div className="flex items-center gap-1.5 border-b border-[#c1c6d7] bg-[#fcf9f8] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          <span className="ml-3 text-xs text-[#c1c6d7]">eventease.app/dashboard</span>
        </div>

        <div className="p-5">
          {/* Stats */}
          <div className="mb-4 grid grid-cols-3 gap-3">
            {[
              { label: 'Événements', value: '24', color: 'text-[#005ab6]', bg: 'bg-blue-50' },
              { label: 'Membres',    value: '12', color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'En attente', value: '3',  color: 'text-orange-600', bg: 'bg-orange-50' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={`rounded-xl ${bg} p-3`}>
                <p className={`text-lg font-bold ${color}`}>{value}</p>
                <p className="text-[11px] text-[#717786]">{label}</p>
              </div>
            ))}
          </div>

          {/* Event list */}
          {[
            { title: 'Team Building Q3', type: 'Team Building', dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700' },
            { title: 'Séminaire annuel',  type: 'Conférence',    dot: 'bg-purple-500',  badge: 'bg-purple-100 text-purple-700' },
            { title: 'Apéritif vendredi', type: 'Apéritif',      dot: 'bg-orange-500',  badge: 'bg-orange-100 text-orange-700' },
          ].map((ev, i) => (
            <motion.div
              key={ev.title}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + i * 0.12 }}
              className="mb-2 flex items-center gap-3 rounded-lg border border-[#c1c6d7] bg-white px-3 py-2.5 last:mb-0"
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${ev.dot}`} />
              <span className="flex-1 truncate text-[12px] font-medium text-[#1c1b1b]">{ev.title}</span>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${ev.badge}`}>
                {ev.type}
              </span>
            </motion.div>
          ))}

          {/* Alerte pending */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.45 }}
            className="mt-3 flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2"
          >
            <Bell className="h-3.5 w-3.5 shrink-0 text-orange-500" />
            <p className="text-[11px] text-orange-700">3 événements en attente de validation</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   Bento cards — mocks UI intégrés
   ══════════════════════════════════════════════════════════════════════════ */
function MockCalendar() {
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
  const cells = Array.from({ length: 35 }, (_, i) => {
    const d = i - 3
    return { day: d > 0 && d <= 30 ? d : null, hasEvent: [5, 12, 19, 22, 26].includes(d) }
  })
  return (
    <div className="rounded-xl border border-[#c1c6d7] bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-[#1c1b1b]">Juin 2026</span>
        <div className="flex gap-1">
          <button className="rounded p-1 text-[#717786] hover:bg-gray-100"><ChevronRight className="h-3.5 w-3.5 rotate-180" /></button>
          <button className="rounded p-1 text-[#717786] hover:bg-gray-100"><ChevronRight className="h-3.5 w-3.5" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px">
        {days.map((d, i) => <div key={i} className="py-1 text-center text-[10px] font-semibold text-[#717786]">{d}</div>)}
        {cells.map((c, i) => (
          <div key={i} className="relative flex h-8 items-center justify-center">
            {c.day ? (
              <>
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${c.day === 19 ? 'font-bold text-white' : 'text-[#414754]'}`}
                  style={c.day === 19 ? { background: 'var(--brand-gradient)' } : {}}>
                  {c.day}
                </span>
                {c.hasEvent && <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-[#005ab6]" />}
              </>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

function MockNotifications() {
  return (
    <div className="space-y-2">
      {[
        { icon: '✅', text: 'Team Building validé par Marie A.', time: 'Il y a 2 min',  color: 'border-emerald-200 bg-emerald-50' },
        { icon: '🔔', text: 'Nouveau membre : pierre@acme.com',   time: 'Il y a 8 min',  color: 'border-blue-200 bg-blue-50' },
        { icon: '⏳', text: 'Apéritif en attente de validation',  time: 'Il y a 15 min', color: 'border-orange-200 bg-orange-50' },
      ].map((n, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 text-xs ${n.color}`}
        >
          <span className="text-base leading-none">{n.icon}</span>
          <div>
            <p className="font-medium text-[#1c1b1b]">{n.text}</p>
            <p className="mt-0.5 text-[#717786]">{n.time}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function MockBarChart() {
  const bars = [60, 85, 45, 92, 70, 55, 78]
  const labels = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
  return (
    <div className="flex h-28 items-end gap-2">
      {bars.map((h, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: `${h}%`, background: i === 3 ? 'var(--brand-gradient)' : undefined, transformOrigin: 'bottom' }}
            className={`w-full rounded-t-md ${i === 3 ? '' : 'bg-[#c1c6d7]'}`}
          />
          <span className="text-[10px] text-[#717786]">{labels[i]}</span>
        </div>
      ))}
    </div>
  )
}

function BentoGrid() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const fadeUp = (delay: number): {
    initial: { opacity: number; y: number }
    animate: { opacity: number; y: number } | Record<string, never>
    transition: Transition
  } => ({
    initial: { opacity: 0, y: 28 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.55, delay, ease: 'easeOut' },
  })

  return (
    <div ref={ref} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

      {/* Grande carte — Création d'events */}
      <motion.div {...fadeUp(0)} className="lg:col-span-2 rounded-2xl border border-[#c1c6d7] bg-white p-6 shadow-sm">
        <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
          <Plus className="h-3 w-3" /> Création d&apos;events
        </div>
        <h3 className="mt-3 text-lg font-bold text-[#1c1b1b]">Proposez, planifiez, publiez</h3>
        <p className="mt-1 mb-5 text-sm text-[#717786]">
          Un formulaire complet — titre, type, lieu, date, image — et votre event part en validation en un clic.
        </p>
        {/* Mini form mock */}
        <div className="space-y-2 rounded-xl border border-[#c1c6d7] bg-[#fcf9f8] p-4">
          {[
            { label: 'Titre',           value: 'Team Building Q3 2026' },
            { label: 'Type',            value: 'Team Building ▾' },
            { label: 'Date & heure',    value: '15 sept. 2026 · 14:00' },
            { label: 'Lieu',            value: 'Palais des Nations, Genève' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-3 rounded-lg border border-[#c1c6d7] bg-white px-3 py-2">
              <span className="w-24 shrink-0 text-[10px] font-semibold text-[#717786]">{label}</span>
              <span className="text-[12px] text-[#1c1b1b]">{value}</span>
            </div>
          ))}
          <div className="mt-1 flex justify-end">
            <span
              className="rounded-lg px-4 py-1.5 text-[11px] font-semibold text-white"
              style={{ background: 'var(--brand-gradient)' }}
            >
              Soumettre →
            </span>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div {...fadeUp(0.1)} className="rounded-2xl border border-[#c1c6d7] bg-white p-6 shadow-sm">
        <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
          <Bell className="h-3 w-3" /> Notifications
        </div>
        <h3 className="mt-3 mb-4 text-base font-bold text-[#1c1b1b]">Restez informé en temps réel</h3>
        <MockNotifications />
      </motion.div>

      {/* Participants */}
      <motion.div {...fadeUp(0.15)} className="rounded-2xl border border-[#c1c6d7] bg-white p-6 shadow-sm">
        <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
          <Users className="h-3 w-3" /> Membres &amp; rôles
        </div>
        <h3 className="mt-3 mb-4 text-base font-bold text-[#1c1b1b]">Gérez votre équipe</h3>
        <div className="space-y-2">
          {[
            { name: 'Marie Admin',    role: 'Admin',  badge: 'bg-blue-100 text-blue-700' },
            { name: 'Jean Membre',    role: 'Membre', badge: 'bg-gray-100 text-gray-600' },
            { name: 'Léa Membre',     role: 'Membre', badge: 'bg-gray-100 text-gray-600' },
          ].map(({ name, role, badge }, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-[#c1c6d7] px-3 py-2">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white"
                  style={{ background: 'var(--brand-gradient)' }}
                >
                  {name[0]}
                </div>
                <span className="text-[12px] font-medium text-[#1c1b1b]">{name}</span>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge}`}>{role}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Calendrier */}
      <motion.div {...fadeUp(0.2)} className="rounded-2xl border border-[#c1c6d7] bg-white p-6 shadow-sm">
        <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
          <CalendarDays className="h-3 w-3" /> Calendrier
        </div>
        <h3 className="mt-3 mb-4 text-base font-bold text-[#1c1b1b]">Vue mensuelle dynamique</h3>
        <MockCalendar />
      </motion.div>

      {/* Dashboard stats */}
      <motion.div {...fadeUp(0.25)} className="rounded-2xl border border-[#c1c6d7] bg-white p-6 shadow-sm">
        <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
          <BarChart3 className="h-3 w-3" /> Dashboard
        </div>
        <h3 className="mt-3 mb-1 text-base font-bold text-[#1c1b1b]">Statistiques hebdo</h3>
        <p className="mb-4 text-xs text-[#717786]">Participations par jour cette semaine</p>
        <MockBarChart />
      </motion.div>

    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   Footer — fond clair
   ══════════════════════════════════════════════════════════════════════════ */
function LandingFooter() {
  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">

          {/* Logo + tagline */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: 'var(--brand-gradient)' }}
              >
                <LayoutGrid className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-bold text-[#1c1b1b]">EvenTease</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#717786]">
              Simplifiez la complexité événementielle de votre organisation.
            </p>
            {/* Réseaux sociaux */}
            <div className="mt-4 flex gap-3">
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#c1c6d7] text-[#717786] transition-colors hover:border-[#005ab6] hover:text-[#005ab6]">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#c1c6d7] text-[#717786] transition-colors hover:border-[#005ab6] hover:text-[#005ab6]">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#414754]">Liens rapides</p>
            <ul className="space-y-2.5">
              {[
                { label: 'Accueil',     href: '#' },
                { label: 'Connexion',   href: '/login' },
                { label: 'Inscription', href: '/register' },
                { label: 'Rejoindre',   href: '/register/join' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-[#717786] transition-colors hover:text-[#1c1b1b]">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Fonctionnalités */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#414754]">Fonctionnalités</p>
            <ul className="space-y-2.5">
              {['Gestion des events', 'Workflow de validation', 'Calendrier', 'Dashboard', 'Rôles & permissions'].map((item) => (
                <li key={item} className="text-sm text-[#717786]">{item}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#414754]">Contact</p>
            <ul className="space-y-2.5 text-sm text-[#717786]">
              <li>hello@origin-studio.ch</li>
              <li>Genève, Suisse</li>
            </ul>
            {/* Newsletter */}
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#414754]">Newsletter</p>
              <div className="flex overflow-hidden rounded-lg border border-[#c1c6d7] bg-white">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-[#1c1b1b] placeholder:text-[#c1c6d7] focus:outline-none"
                />
                <button
                  className="px-3 py-2 text-white"
                  style={{ background: 'var(--brand-gradient)' }}
                  aria-label="S'abonner"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barre copyright */}
      <div className="border-t border-[#c1c6d7]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <p className="text-xs text-[#717786]">
            © {new Date().getFullYear()} EvenTease — Réalisé par{' '}
            <a
              href="https://www.origin-studio.ch"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#005ab6] transition-colors hover:text-[#0080ff]"
            >
              Origin Studio
            </a>
          </p>
          <div className="flex gap-5 text-xs text-[#717786]">
            <span className="cursor-pointer transition-colors hover:text-[#1c1b1b]">Confidentialité</span>
            <span className="cursor-pointer transition-colors hover:text-[#1c1b1b]">CGU</span>
            <span className="cursor-pointer transition-colors hover:text-[#1c1b1b]">Mentions légales</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   Page
   ══════════════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />

      {/* ── Hero — fond clair ──────────────────────────────────────────────── */}
      <section id="hero" className="relative overflow-hidden bg-white pt-16">
        {/* Grille décorative */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#005ab6 1px, transparent 1px), linear-gradient(90deg, #005ab6 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Orb doux */}
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full opacity-[0.07] blur-3xl"
          style={{ background: 'var(--brand-gradient)' }}
        />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pb-20 pt-20 lg:grid-cols-2 lg:items-center">

          {/* Texte */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c1c6d7] bg-[#fcf9f8] px-4 py-1.5 text-xs font-medium text-[#414754]"
            >
              <Sparkles className="h-3.5 w-3.5 text-purple-500" />
              Plateforme événementielle multi-tenant
            </motion.div>

            <h1 className="mb-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-[#1c1b1b] sm:text-5xl lg:text-[3.25rem]">
              <AnimatedText text="Gérez vos" />
              {' '}
              <span className="block">
                <AnimatedText text="événements" />
                {' '}
                <span
                  className="inline-block"
                  style={{
                    background: 'var(--brand-gradient)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  <AnimatedText text="d'entreprise" />
                </span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.9 }}
              className="mb-8 max-w-lg text-base leading-relaxed text-[#717786] sm:text-lg"
            >
              De la proposition à la validation, EvenTease centralise la vie événementielle de votre organisation avec un workflow clair et des rôles définis.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.05 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--brand-gradient)' }}
              >
                Créer mon espace gratuitement
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center rounded-xl border border-[#c1c6d7] bg-white px-6 py-3 text-sm font-semibold text-[#414754] transition-colors hover:border-[#005ab6] hover:text-[#005ab6]"
              >
                Se connecter
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.35 }}
              className="mt-7 flex flex-wrap gap-x-6 gap-y-2"
            >
              {['Validation par workflow', 'Invitations par code', 'Multi-tenant isolé'].map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-xs text-[#717786]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  {item}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Mock dashboard clair */}
          <div className="lg:pl-6">
            <MockDashboardLight />
          </div>
        </div>
      </section>

      {/* ── Features — bento grid ─────────────────────────────────────────── */}
      <section id="features" className="bg-[#fcf9f8] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#005ab6]"
            >
              Fonctionnalités Clés
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.07 }}
              className="text-3xl font-extrabold tracking-tight text-[#1c1b1b] sm:text-4xl"
            >
              Tout ce dont votre équipe a besoin
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.14 }}
              className="mx-auto mt-3 max-w-xl text-sm text-[#717786]"
            >
              Un workflow pensé pour les équipes de toute taille, avec des rôles clairs et une interface intuitive.
            </motion.p>
          </div>

          <BentoGrid />
        </div>
      </section>

      {/* ── CTA final ─────────────────────────────────────────────────────── */}
      <section className="border-t border-[#c1c6d7] bg-white py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#005ab6]">
              Prêt à démarrer ?
            </p>
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-[#1c1b1b] sm:text-4xl">
              Donnez vie à vos projets d&apos;événements{' '}
              <span
                style={{
                  background: 'var(--brand-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                aujourd&apos;hui.
              </span>
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-[#717786]">
              Créez votre organisation, invitez vos collègues avec un code unique et commencez à planifier vos events.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--brand-gradient)' }}
              >
                Commencer maintenant
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center rounded-xl border border-[#c1c6d7] px-7 py-3.5 text-sm font-semibold text-[#414754] transition-colors hover:border-[#005ab6] hover:text-[#005ab6]"
              >
                Parler à un expert
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}
