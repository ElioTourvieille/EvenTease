# CLAUDE.md — EvenTease
> Dernière mise à jour : juin 2025
> Contexte : Refactoring + migration d'un projet école MERN vers stack Origin Studio

---

## 🎯 Objectif du projet

Application de gestion d'événements **multi-tenant** avec workflow de validation.
Chaque entreprise a son propre espace isolé. Les membres peuvent proposer des events,
les admins valident. Projet vitrine **Origin Studio** (https://www.origin-studio.ch).

---

## 📐 Architecture cible (où on va)

```
eventease/
├── frontend/                    ← Next.js 14 App Router + TypeScript strict
│   ├── app/
│   │   ├── (public)/            ← sans layout authentifié
│   │   │   ├── page.tsx         ← Landing page
│   │   │   ├── login/page.tsx
│   │   │   └── register/
│   │   │       ├── page.tsx     ← Choix : créer espace ou rejoindre
│   │   │       ├── create/page.tsx  ← Flow owner (crée l'org)
│   │   │       └── join/page.tsx    ← Flow member (code d'invitation)
│   │   ├── (app)/               ← avec NavBar, sans sidebar
│   │   │   └── main/page.tsx    ← liste des events published
│   │   ├── (dashboard)/         ← avec Sidebar
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx     ← stats générales
│   │   │   │   └── pending/page.tsx ← events en attente de validation
│   │   │   ├── calendar/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   ├── myevents/page.tsx
│   │   │   ├── members/page.tsx     ← gestion des membres (admin/owner)
│   │   │   └── settings/page.tsx    ← code invitation, infos org
│   │   └── events/
│   │       ├── create/page.tsx
│   │       └── [id]/page.tsx    ← détail event (remplace la popup)
│   ├── components/
│   │   ├── ui/                  ← Shadcn/ui uniquement
│   │   ├── layout/              ← Header, NavBar, SideBar, Footer
│   │   └── events/              ← EventCard, EventForm, EventStatusBadge
│   └── lib/
│       ├── types/
│       │   ├── user.types.ts
│       │   ├── event.types.ts
│       │   └── organization.types.ts
│       ├── api/
│       │   ├── client.ts        ← instance Axios + intercepteurs
│       │   ├── events.api.ts
│       │   ├── auth.api.ts
│       │   └── organizations.api.ts
│       ├── store/
│       │   └── auth.store.ts    ← Zustand + persist
│       └── utils/
│           └── permissions.ts   ← helpers canCreate, canValidate, etc.
│
└── backend/                     ← NestJS + TypeScript + MongoDB
    └── src/
        ├── auth/                ← JWT access + refresh tokens
        ├── users/               ← CRUD users
        ├── events/              ← CRUD events + workflow validation
        ├── organizations/       ← CRUD orgs + gestion inviteCode
        └── uploads/             ← Multer uniquement
```

---

## 🗄️ Modèle de données MongoDB

### Organization
```typescript
{
  _id: ObjectId,
  name: string,           // "Origin Studio"
  type: 'Entreprise' | 'Association' | 'Autres',
  ownerId: ObjectId,      // ref → User
  inviteCode: string,     // code unique généré à la création (ex: "OS-A3K9")
  createdAt: Date
}
```

### User
```typescript
{
  _id: ObjectId,
  first_name: string,
  last_name: string,
  email: string,          // unique
  password: string,       // bcrypt hash
  organizationId: ObjectId, // ref → Organization
  role: 'owner' | 'admin' | 'member',
  createdAt: Date
}
```

### Event
```typescript
{
  _id: ObjectId,
  title: string,
  type: 'Team Building' | 'Conférence' | 'Apéritif' | 'Autres',
  invitation: 'Ouvert à tous' | 'Equipe de direction' | 'Service concerné',
  date: string,
  time: string,
  address: string,
  description: string,
  image?: string,         // URL Multer upload
  organizationId: ObjectId, // ref → Organization (remplace est_name string)
  createdBy: ObjectId,    // ref → User
  participants: ObjectId[], // ref → User[]
  status: 'pending' | 'published' | 'cancelled',
  cancelReason?: string,  // rempli si status === 'cancelled'
  createdAt: Date
}
```

---

## 👥 Rôles et permissions

| Action                        | owner | admin | member        |
|-------------------------------|-------|-------|---------------|
| Créer un espace entreprise    | ✅    | ❌    | ❌            |
| Inviter un admin              | ✅    | ❌    | ❌            |
| Inviter un member             | ✅    | ✅    | ❌            |
| Créer un event                | ✅    | ✅    | ✅ (pending)  |
| Valider / refuser un event    | ✅    | ✅    | ❌            |
| Modifier un event             | ✅    | ✅    | son event     |
| Supprimer un event            | ✅    | ✅    | son event     |
| S'inscrire à un event         | ✅    | ✅    | ✅            |
| Voir les events published     | ✅    | ✅    | ✅            |
| Voir les events pending       | ✅    | ✅    | son event     |
| Gérer les membres             | ✅    | ✅    | ❌            |
| Voir les settings org         | ✅    | ✅    | ❌            |

---

## 🔄 Workflows principaux

### Flow 1 — Créer un espace entreprise
```
/register → "Créer mon espace"
  └── Formulaire : prénom, nom, email, mdp, nom entreprise, type
  └── Crée Organization + User (role: owner)
  └── Génère inviteCode unique (format: "XXXX-XXXX")
  └── → Dashboard avec code affiché + bouton copier
```

### Flow 2 — Rejoindre via invitation
```
/register → "Rejoindre une entreprise"
  └── Formulaire : prénom, nom, email, mdp, code invitation
  └── Vérifie inviteCode → récupère Organization
  └── Crée User (role: member, organizationId)
  └── → /main (liste des events published)
```

### Flow 3 — Proposer un event (member)
```
/events/create
  └── Formulaire identique à l'actuel
  └── Event créé avec status: 'pending'
  └── → Message : "Votre événement est en attente de validation"
  └── Notification aux admins/owner de l'org
```

### Flow 4 — Valider un event (admin / owner)
```
/dashboard/pending
  └── Liste des events status: 'pending' de l'organisation
  └── Bouton "Valider" → status: 'published'
  └── Bouton "Refuser" → modal raison → status: 'cancelled'
  └── Notification au member créateur dans les deux cas
```

---

## 🐛 Bugs du code original à corriger (avant migration)

Ces bugs existent dans le code CRA actuel et doivent être
corrigés DANS le nouveau code Next.js, pas dans l'ancien.

| Fichier | Bug | Fix |
|---------|-----|-----|
| CardOne.js | `userCount * 10` — donnée fausse | appel API réel |
| CardTwo.js | `{eventCount}0` — concatène "0" | `{eventCount}` |
| CardThree.js | `useState(40)` hardcodé | appel API réel |
| CardFour.js | `useState(2)` hardcodé | appel API réel |
| PopupDialogEvent.js | updateEvent sans l'ID | passer `event._id` |
| Calendar.js | 31 jours statiques, pas de navigation | calendrier dynamique |
| authService.js | updateUser sans token Bearer | ajouter Authorization header |
| Register.js | select est_type non lié au state | onChange manquant |
| EventItem.js | Google Maps hardcodée (SAE Genève) | adresse dynamique |
| EventItem.js | image teamBuilding.jpg pour tous | image depuis event.image |
| Footer.js | Instagram/Facebook → "/" | vraies URLs sociales |
| Navigation.js | paths /products /orders /customers | paths corrects |

---

## 🔑 TypeScript — Types principaux

```typescript
// lib/types/organization.types.ts
export interface Organization {
  _id: string
  name: string
  type: 'Entreprise' | 'Association' | 'Autres'
  ownerId: string
  inviteCode: string
  createdAt: Date
}

// lib/types/user.types.ts
export type UserRole = 'owner' | 'admin' | 'member'

export interface User {
  _id: string
  first_name: string
  last_name: string
  email: string
  organizationId: string
  role: UserRole
  token: string
}

// lib/types/event.types.ts
export type EventStatus = 'pending' | 'published' | 'cancelled'
export type EventType = 'Team Building' | 'Conférence' | 'Apéritif' | 'Autres'
export type EventAccess = 'Ouvert à tous' | 'Equipe de direction' | 'Service concerné'

export interface Event {
  _id: string
  title: string
  type: EventType
  invitation: EventAccess
  date: string
  time: string
  address: string
  description: string
  image?: string
  organizationId: string
  createdBy: string
  participants: string[]
  status: EventStatus
  cancelReason?: string
  createdAt: Date
}

export type CreateEventDto = Omit<Event,
  '_id' | 'participants' | 'status' | 'createdAt' | 'createdBy'
>

// lib/utils/permissions.ts
export const canValidateEvent  = (role: UserRole) => role !== 'member'
export const canManageMembers  = (role: UserRole) => role !== 'member'
export const canInviteAdmin    = (role: UserRole) => role === 'owner'
export const canDeleteEvent    = (role: UserRole, userId: string, createdBy: string) =>
  role !== 'member' || userId === createdBy
```

---

## ✅ Conventions du projet

### TypeScript
- Strict mode activé : `"strict": true`, `"noUncheckedIndexedAccess": true`
- Zéro `any` toléré — si besoin, `unknown` + type guard
- Path alias `@/*` → `./src/*` partout
- Types exportés depuis `lib/types/index.ts` (barrel export)

### NestJS (backend)
- Un dossier par feature : `auth/`, `events/`, `users/`, `organizations/`, `uploads/`
- Structure : `module.ts`, `controller.ts`, `service.ts`, `dto/`, `schemas/`
- Validation : `class-validator` + `class-transformer` sur tous les DTOs
- Guards : `JwtAuthGuard` + `RolesGuard` sur toutes les routes protégées
- Decorator custom `@Roles('owner', 'admin')` pour le contrôle d'accès
- Nommage : camelCase fonctions, PascalCase classes/DTOs

### Next.js (frontend)
- App Router uniquement — zéro `pages/`
- Server Components par défaut
- `'use client'` uniquement si : hooks React, events browser, store Zustand
- Zustand pour l'état global (user connecté)
- Pas de Redux — aucune exception
- Sonner pour les toasts (remplace react-toastify)
- Shadcn/ui dans `components/ui/` — ne pas modifier ces fichiers
- Composants métier dans `components/events/`, `components/layout/`

### Git
- Commits : `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`
- Une branche par session de migration
- PR obligatoire avant merge sur main
- Jamais de merge direct sur main

---

## 📋 Ordre de migration — Sessions

```
Pré-migration (toi, sans IA) :
  ✦ Supprimer packages doublons (toastify, url, colors, express-fileupload)
  ✦ Placer ce CLAUDE.md à la racine du repo

Session 1  — Setup Next.js : structure dossiers, config TS, Tailwind
Session 2  — Types TS + store Zustand + client Axios
Session 3  — Layouts : Header, NavBar, SideBar, Footer
Session 4  — Auth pages : Login, Register (flows create + join)
Session 5  — Backend NestJS : setup + module Auth + module Organizations
Session 6  — Backend NestJS : module Events (CRUD + workflow validation)
Session 7  — Backend NestJS : module Users + guards + roles
Session 8  — Frontend : pages Main + EventCard + EventDetail
Session 9  — Frontend : Dashboard + pages admin (pending, members, settings)
Session 10 — Frontend : Calendar (dynamique), Profile, MyEvents
Session 11 — Tests : Auth + Events (objectif 80% coverage)
Session 12 — Polish UI pour vitrine Origin Studio
```

---

## 🚀 Commandes

```bash
# Backend (NestJS)
npm run start:dev      # dev avec hot reload (port 8000)
npm run test           # unit tests
npm run test:e2e       # integration tests
npm run build          # build prod

# Frontend (Next.js)
npm run dev            # dev (port 3000)
npm run build          # build prod
npm run lint           # ESLint
```

---

## ⛔ Ce qu'il NE faut PAS faire

- Ne pas modifier les fichiers `.env`
- Ne pas toucher les fichiers dans `components/ui/` (Shadcn)
- Ne pas utiliser `any` en TypeScript
- Ne pas merger plusieurs sessions en une seule
- Ne pas passer à la session suivante sans validation explicite
- Ne pas utiliser Redux — Zustand uniquement
- Ne pas créer de route dans `pages/` — App Router uniquement

---

## 💡 Notes pour Claude Code

- Projet vitrine Origin Studio (studio web genevois, Geneva CH)
- Langue de l'interface : français
- Priorité : code lisible et maintenable > optimisation prématurée
- Si tu identifies un problème de sécurité, signale-le AVANT de corriger
- Une session = un périmètre défini = validation avant de continuer
- Ne jamais modifier plusieurs modules simultanément
- Toujours montrer le plan avant d'écrire du code
