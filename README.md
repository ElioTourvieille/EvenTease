# EvenTease

EvenTease est une application web qui a été développé pour gérer des événements. Elle permet de créer, modifier, supprimer et lister des événements. Elle permet également de gérer les utilisateurs et les rôles.

## 🛠️ Tech Stack
- [Mongo](https://www.mongodb.com/fr-fr)
-  [Express](https://expressjs.com/fr/)
- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Prérequis
- Node.js (vérifiez avec "node -v")
- npm (vérifiez avec "npm -v")
- Git (vérifiez avec "git --version")

## Installation
### Cloner le Git Depository
```
git clone https://github.com/ElioTourvieille/EvenTease.git
```
### A la racine du projet
```
cd event-management
```
Installer les dépendances
```
cd client
npm install

cd ../server
npm install
```
## Lancement de l'application
Grâce au module "concurrently" possibilité de lancer le client et le server en même temps
``` 
cd server
npm run dev
```
Sinon lancer les 2 séparemment
```
cd client
npm run start

cd server
npm run server
```

### Connexion

| Paramètre| Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email`  | `email` | e.tourvieille@gmail.com   |
| `password`| `password` | 1234 |
