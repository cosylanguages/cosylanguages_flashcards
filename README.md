# Cosy Flashcards — GitHub-ready starter repo

**Purpose:** Minimal, GitHub-ready flashcards app (backend: Node + Express + SQLite; frontend: React) implementing core features:

This is a starter template to hand off to developers or run locally.

## Quick start (development)

Requirements:

### Backend
```bash
cd backend
npm install
npm run dev
# server runs on http://localhost:4000
```

### Frontend
```bash
cd frontend
npm install
npm start
# app runs on http://localhost:3000
```

### Docker (optional)
A `docker-compose.yml` is provided for running backend + frontend via Node images.

## Project structure

## Notes
This is a minimal starter. Add real authentication, tests, input validation, HTTPS, production-ready DB (Postgres), and CI before shipping.

## Mode démo statique (GitHub Pages)

Sur GitHub Pages, seule l’interface frontend React est disponible : vous pouvez voir et tester l’UI avec des decks et cartes fictives.

Pour utiliser toutes les fonctionnalités (authentification, édition, import/export, médias), déployez le backend Node/Express + Postgres sur une plateforme cloud (Railway, Render, Heroku, etc.) et configurez l’URL du backend dans le frontend.

**Astuce :** Le mode démo s’active automatiquement si l’API backend n’est pas accessible.
