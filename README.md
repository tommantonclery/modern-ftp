# 🌐 Modern FTP

Modern FTP is a sleek, secure, and beautifully designed SFTP management platform.  
Built for modern teams who need full file server access, previews, uploads, and connection management — all in a modern web interface.

---

## 🧩 Monorepo Structure

This project is organized into two apps:

```
apps/
├── modern-ftp/            # Next.js frontend (file browser, auth, UI)
└── sftp-service/   # Node.js backend for handling SFTP logic (via ssh2)
```

Supports `npm` or `pnpm` workspaces for clean dependency management.

---

## 🚀 Features

- ⚡️ Ultra-fast file browsing over SFTP
- 📂 Drag & drop file uploads
- 🧾 Full file previews (PDF, code, images, etc.)
- 🔐 Google OAuth via Auth.js
- 🧠 Connection manager with save/edit/delete
- 🟢 Health indicator for each connection
- 🧼 UI built with shadcn/ui (Tailwind + Radix)

---

## 🔧 Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/modern-ftp.git
cd modern-ftp
npm install
```

Run each package individually:

### 🖥 Start the Web Frontend

```bash
cd apps/modern-ftp
npm run dev
```

### 🛠 Start the SFTP Service

```bash
cd apps/sftp-service
node index.js
```

---

## 🛠 Technologies

- [Next.js 14+](https://nextjs.org/)
- [Auth.js](https://authjs.dev/) with Google OAuth
- [Prisma + PostgreSQL](https://www.prisma.io/)
- [ssh2](https://github.com/mscdex/ssh2) for SFTP
- [shadcn/ui](https://ui.shadcn.dev) for styling
- [pdf.js](https://mozilla.github.io/pdf.js/) for PDF previews
- React Hook Form + Zod for typed forms

---

## 🧪 Roadmap / TODO

- [x] Upload support (drag/drop + picker)
- [x] Multi-file select + batch actions
- [x] File search with keyboard navigation
- [ ] Directory creation / rename / move
- [ ] Multi-user collaboration
- [ ] Self-hosted deployment guide
- [ ] Realtime SFTP log viewer

---

## 👥 Contributing

1. Fork this repo
2. Create a branch `git checkout -b feature/thing`
3. Make your changes
4. Push and open a PR

---

## 📝 License

MIT © 2025 tommantonclery#
