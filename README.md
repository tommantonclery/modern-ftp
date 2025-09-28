# 🌐 Modern FTP

A web-based SFTP client I built to explore how far I could take file management in the browser.
It lets you connect to remote servers, browse files, preview documents, and upload content — all from a clean Next.js frontend.

---

## Why I Built This

I’ve used a lot of clunky FTP clients in the past, and I wanted to see if I could make something that felt smoother and more modern. This project was also a chance to deepen my skills with:

* Next.js and server-side auth flows
* Managing real SFTP connections in Node
* Designing a UI with **shadcn/ui** that feels approachable

---

## How It’s Organized

This repo is a monorepo with two main apps:

```
apps/
├── modern-ftp/      # Next.js frontend (file browser, auth, UI)
└── sftp-service/    # Node.js backend for SFTP logic (via ssh2)
```

It uses npm/pnpm workspaces to keep dependencies tidy.

---

## Features

* Browse remote file systems over SFTP
* Drag-and-drop file uploads
* Preview PDFs, images, and code directly in the browser
* Google OAuth for login
* Save and manage multiple server connections
* Connection health indicator
* UI built with shadcn/ui (Tailwind + Radix)

---

## Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/YOUR_USERNAME/modern-ftp.git
cd modern-ftp
npm install
```

Run the frontend:

```bash
cd apps/modern-ftp
npm run dev
```

Run the backend:

```bash
cd apps/sftp-service
node index.js
```

---

## Tech Stack

* Next.js 14+
* Auth.js + Google OAuth
* Prisma + PostgreSQL
* ssh2 (SFTP)
* shadcn/ui (Tailwind + Radix)
* pdf.js for document previews
* React Hook Form + Zod for validation

---

## Roadmap

* ✅ Upload support (drag/drop + picker)
* ✅ Multi-file selection + batch actions
* ✅ File search with keyboard navigation
* ⬜ Directory creation / rename / move
* ⬜ Multi-user collaboration
* ⬜ Self-hosted deployment guide
* ⬜ Realtime SFTP log viewer

---

## What I Learned

This project taught me a lot about:

* Handling long-lived SSH connections in Node
* Building authentication flows with Auth.js
* Structuring a monorepo with both frontend and backend apps
* Designing UIs that balance utility and simplicity

---

## License

MIT © 2025 tommantonclery
