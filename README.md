# Beat Blog ✍️

A modern, full‑featured blogging platform with React and Express, designed for smooth reading, writing, and managing articles with a clean admin experience.

## Deployed Website

- You can check the project at :: https://beat-blog-client.vercel.app
- Video demo showing feature of this project :: https://youtu.be/DlnaDWBZUgA

## 🌟 Features

### Core Functionality

- **Posts & Categories**: Create, edit, delete, and categorize blog posts.
- **User Authentication**: Secure signup, login, reset password; protected routes.
- **Admin Tools**: Admin dashboard for managing posts, categories, notifications, and profile.
- **Notifications**: Admin notification center.
- **File Uploads**: Image uploads via Supabase storage.
- **Markdown Support**: Readable article formatting with `react-markdown`.

### User Experience

- **Responsive Design**: Tailwind CSS + Shadcn UI components.
- **Fast Navigation**: React Router with route guards for auth.
- **Polished UI**: Dialogs, dropdowns, skeletons, spinners, and toasts.

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 19 (Vite 7)
- **Routing**: React Router
- **Styling**: Tailwind CSS + Tailwind Animate
- **UI Components**: Shadcn UI, Lucide icons
- **HTTP**: Axios (with JWT interceptor)
- **Markdown**: react-markdown

### Backend & Infrastructure

- **Server**: Express 5
- **Database**: PostgreSQL (`pg`)
- **Uploads/Storage**: Supabase SDK
- **Middleware**: Multer, CORS
- **Runtime**: Node.js
- **Deployment**: Vercel (client + server)
