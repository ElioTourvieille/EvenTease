# CLAUDE.md — EvenTease
> Dernière mise à jour : juin 2025
> Contexte : Refactoring + migration d'un projet école MERN vers stack Origin Studio

---

## 🎯 Objectif du projet

Application de gestion d'événements (CRUD complet) avec gestion des utilisateurs et des rôles.
Projet initialement scolaire, en cours de migration vers vitrine portfolio **Origin Studio** (https://www.origin-studio.ch).

---

## 📐 Architecture cible (où on va)

```
eventease/
├── frontend/          ← Next.js 14 App Router (migration depuis CRA/React)
│   ├── app/
│   │   ├── (auth)/    ← login, register
│   │   ├── (dashboard)/
│   │   │   ├── events/
│   │   │   └── users/
│   │   └── layout.tsx
│   ├── components/
│   ├── lib/           ← utils, api client, types
│   └── store/         ← Zustand (migration depuis Redux)
│
└── backend/           ← NestJS (migration depuis Express)
    └── src/
        ├── auth/      ← JWT maison (access + refresh tokens)
        ├── events/    ← CRUD événements
        ├── users/     ← CRUD users + rôles
        └── uploads/   ← gestion fichiers (Multer uniquement)
```

---

## 🏗️ État actuel (d'où on part)

### Frontend — React 18 + CRA (à migrer)
- **State management :** Redux Toolkit → remplacer par Zustand
- **Routing :** React Router DOM v6 → remplacer par Next.js App Router
- **UI :** Radix UI Themes + Tailwind CSS → conserver Tailwind, remplacer Radix Themes par Shadcn/ui
- **HTTP :** Axios → conserver (ou migrer vers fetch natif + server actions)
- **Animations :** Framer Motion → conserver si pertinent
- **Toast :** `react-toastify` ET `toastify` installés → supprimer les deux, utiliser Sonner

### Backend — Express.js (à migrer vers NestJS)
- **Auth :** JWT maison avec bcryptjs → conserver la logique, migrer vers module NestJS
- **DB :** MongoDB via Mongoose → conserver
- **Upload :** `express-fileupload` ET `multer` installés → supprimer express-fileupload, conserver Multer uniquement
- **Logging :** package `colors` → SUPPRIMER (incident sécurité 2022), utiliser le logger NestJS natif

---

## ✅ Conventions du projet cible

### TypeScript
- Strict mode activé partout (`"strict": true`)
- Zéro `any` toléré
- Types dans `types/` ou colocalisés avec leur module

### NestJS (backend)
- Un dossier par feature : `auth/`, `events/`, `users/`, `uploads/`
- Structure par module : `module.ts`, `controller.ts`, `service.ts`, `dto/`, `entities/`
- Validation : `class-validator` + `class-transformer` sur tous les DTOs
- Guards : `JwtAuthGuard` sur toutes les routes protégées
- Nommage : camelCase fonctions, PascalCase classes/DTOs

### Next.js (frontend)
- App Router uniquement (pas de pages/)
- Server Components par défaut, Client Components uniquement si nécessaire (`'use client'`)
- Pas de Redux, état global via Zustand uniquement
- Utilisation de Tailwind v4
- Composants UI dans `components/ui/` (Shadcn/ui)
- Composants métier dans `components/` à la racine feature

### Git
- Convention commits : `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`
- Une branche par feature, PR obligatoire
- Pas de merge direct sur main

---

## 🔑 Fonctionnalités à implémenter / migrer

### Auth
- [x] Register / Login (JWT maison)
- [ ] Refresh tokens (à ajouter)
- [ ] Logout avec invalidation token
- [ ] Rôles : USER, ADMIN (déjà en place côté Express, à migrer)

### Events (CRUD)
- [x] Créer un événement
- [x] Lister les événements
- [x] Modifier un événement
- [x] Supprimer un événement
- [ ] Upload d'image pour un événement (Multer → NestJS)
- [ ] Pagination de la liste

### Users
- [x] Gestion des utilisateurs
- [x] Gestion des rôles
- [ ] Profil utilisateur

---

## ⛔ Ce qu'il NE faut PAS toucher

- Les fichiers `.env` (gérés manuellement, ne pas les modifier ni les créer)
- La logique métier de calcul des rôles (à identifier dans l'ancien code avant toute modification)
- Les schémas Mongoose existants : ne pas les migrer sans validation explicite

---

## 🚫 Packages à supprimer immédiatement

```bash
# Frontend
npm uninstall toastify url

# Backend
npm uninstall colors express-fileupload
```

---

## 🧪 Tests

Actuellement : aucun test en place.
Objectif phase 1 : 80% coverage sur les modules `auth` et `events` (NestJS).
Framework : Jest + Supertest pour les tests d'intégration NestJS.

---

## 🚀 Commandes

```bash
# Backend (NestJS - cible)
npm run start:dev     # dev avec hot reload
npm run test          # unit tests
npm run test:e2e      # integration tests
npm run build         # build prod

# Frontend (Next.js - cible)
npm run dev           # dev
npm run build         # build prod
npm run lint          # ESLint

# Actuel (avant migration)
# Backend : nodemon server/server.js (port 8000)
# Frontend : react-scripts start (port 3000, proxy → 8000)
```

---

## 📋 Ordre de migration recommandé

```
Étape 1 : Supprimer les doublons de packages (5min)
Étape 2 : Setup NestJS backend + migration module Auth
Étape 3 : Migration module Events (CRUD)
Étape 4 : Migration module Users + Rôles
Étape 5 : Setup Next.js frontend (App Router)
Étape 6 : Migration UI Events
Étape 7 : Migration Auth UI
Étape 8 : Tests (Auth + Events en priorité)
Étape 9 : Polish UI pour vitrine Origin Studio
```

---

## 💡 Notes pour Claude Code

- Ce projet va être présenté sur le site vitrine d'Origin Studio (studio web genevois)
- Priorité : code lisible et maintenable > optimisation prématurée
- Si tu identifies d'autres problèmes de sécurité dans le code existant, signale-les avant de les corriger
- Chaque étape de migration doit être validée avant de passer à la suivante
- Ne pas modifier plusieurs modules simultanément